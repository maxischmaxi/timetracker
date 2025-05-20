package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"time"

	"connectrpc.com/connect"
	"github.com/go-pdf/fpdf"
	offersv1 "github.com/maxischmaxi/ljtime-api/offers/v1"
	"github.com/maxischmaxi/ljtime-api/offers/v1/offersv1connect"
	orgv1 "github.com/maxischmaxi/ljtime-api/org/v1"
	positionsv1 "github.com/maxischmaxi/ljtime-api/positions/v1"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type OffersServer struct {
	offersv1connect.UnimplementedOffersServiceHandler
}

type DbOffer struct {
	Id          bson.ObjectID `bson:"_id"`
	OfferNo     string        `bson:"offer_no"`
	Note        string        `bson:"note"`
	CustomerId  string        `bson:"customer_id"`
	Positions   []DbPosition  `bson:"positions"`
	LegalNotice string        `bson:"legal_notice"`
	Payment     DbPayment     `bson:"payment"`
	Discount    DbDiscount    `bson:"discount"`
	DateOfIssue string        `bson:"date_of_issue"`
	ValidUntil  string        `bson:"valid_until"`
	CreatedAt   int64         `bson:"created_at"`
	UpdatedAt   int64         `bson:"updated_at"`
	OrgId       bson.ObjectID `bson:"org_id"`
}

func GetOfferById(ctx context.Context, id string) (*offersv1.Offer, error) {
	offerId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": offerId}

	var offer DbOffer
	if err := OFFERS.FindOne(ctx, filter).Decode(&offer); err != nil {
		return nil, err
	}

	return offer.ToOffer(), nil
}

func (o *DbOffer) ToOffer() *offersv1.Offer {
	var positions []*positionsv1.Position

	for _, p := range o.Positions {
		positions = append(positions, &positionsv1.Position{
			Id:          p.Id.Hex(),
			Name:        p.Name,
			Description: p.Description,
			Count:       p.Count,
			Price:       p.Price,
			Unit:        positionsv1.PositionUnit(p.Unit),
		})
	}

	payment := orgv1.Payment{
		BankName: o.Payment.BankName,
		Iban:     o.Payment.Iban,
		Bic:      o.Payment.Bic,
	}

	discount := positionsv1.Discount{
		Value: o.Discount.Value,
		Type:  positionsv1.DiscountType(o.Discount.Type),
	}

	return &offersv1.Offer{
		Id:          o.Id.Hex(),
		OfferNo:     o.OfferNo,
		Note:        o.Note,
		CustomerId:  o.CustomerId,
		Positions:   positions,
		LegalNotice: &o.LegalNotice,
		Payment:     &payment,
		Discount:    &discount,
		DateOfIssue: o.DateOfIssue,
		ValidUntil:  o.ValidUntil,
		CreatedAt:   o.CreatedAt,
		UpdatedAt:   o.UpdatedAt,
		OrgId:       o.OrgId.Hex(),
	}
}

func GetOffersByOrgId(ctx context.Context, id string) ([]*offersv1.Offer, error) {
	orgId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	filter := bson.M{
		"org_id": orgId,
	}

	cursor, err := OFFERS.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	var offers []*offersv1.Offer
	for cursor.Next(ctx) {
		var offer DbOffer
		if err := cursor.Decode(&offer); err != nil {
			return nil, err
		}
		offers = append(offers, offer.ToOffer())
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return offers, nil
}

func (s *OffersServer) GetOfferPdf(ctx context.Context, req *connect.Request[offersv1.GetOfferPdfRequest]) (*connect.Response[offersv1.GetOfferPdfResponse], error) {
	offer, err := GetOfferById(ctx, req.Msg.OfferId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	fileData, err := GenerateBlanko(offer)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&offersv1.GetOfferPdfResponse{
		PdfData: fileData,
	}), nil
}

func (s *OffersServer) CreateOffer(ctx context.Context, req *connect.Request[offersv1.CreateOfferRequest]) (*connect.Response[offersv1.CreateOfferResponse], error) {
	id := bson.NewObjectID()

	positions := make([]DbPosition, len(req.Msg.Positions))

	for _, p := range req.Msg.Positions {
		positions = append(positions, DbPosition{
			Id:          bson.NewObjectID(),
			Name:        p.Name,
			Description: p.Description,
			Count:       p.Count,
			Price:       p.Price,
			Unit:        int32(p.Unit),
		})
	}

	now := time.Now().Unix()
	discount := DbDiscount{
		Value: req.Msg.Discount.Value,
		Type:  int32(req.Msg.Discount.Type),
	}

	orgId, err := bson.ObjectIDFromHex(req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	offer := DbOffer{
		Id:          id,
		OfferNo:     req.Msg.OfferNo,
		Note:        req.Msg.Note,
		CustomerId:  req.Msg.CustomerId,
		LegalNotice: req.Msg.LegalNotice,
		Payment: DbPayment{
			Iban:     req.Msg.Payment.Iban,
			BankName: req.Msg.Payment.BankName,
			Bic:      req.Msg.Payment.Bic,
		},
		Positions:   positions,
		Discount:    discount,
		CreatedAt:   now,
		UpdatedAt:   now,
		ValidUntil:  req.Msg.ValidUntil,
		DateOfIssue: req.Msg.DateOfIssue,
		OrgId:       orgId,
	}

	_, err = OFFERS.InsertOne(ctx, offer)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	responseOffer := offer.ToOffer()

	return connect.NewResponse(&offersv1.CreateOfferResponse{
		Offer: responseOffer,
	}), nil
}

func (s *OffersServer) GetOffersByCustomerId(ctx context.Context, req *connect.Request[offersv1.GetOffersByCustomerIdRequest]) (*connect.Response[offersv1.GetOffersByCustomerIdResponse], error) {
	filter := bson.M{"customer_id": req.Msg.CustomerId}

	cursor, err := CUSTOMERS.Find(ctx, filter)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	defer cursor.Close(ctx)

	var offers []*offersv1.Offer
	for cursor.Next(ctx) {
		var offer DbOffer
		if err := cursor.Decode(&offer); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		offers = append(offers, offer.ToOffer())
	}

	if err := cursor.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&offersv1.GetOffersByCustomerIdResponse{
		Offers: offers,
	}), nil
}

func (s *OffersServer) GetOffersByOrgId(ctx context.Context, req *connect.Request[offersv1.GetOffersByOrgIdRequest]) (*connect.Response[offersv1.GetOffersByOrgIdResponse], error) {
	offers, err := GetOffersByOrgId(ctx, req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&offersv1.GetOffersByOrgIdResponse{
		Offers: offers,
	}), nil
}

func getNextOfferNumber(offers []*offersv1.Offer) string {
	currentYear := time.Now().Year()
	latestOfferYear := 0
	latestOfferNo := 0

	for _, o := range offers {
		re := regexp.MustCompile(`(\d{4})-(\d+)`)
		match := re.FindStringSubmatch(o.OfferNo)

		if match == nil {
			continue
		}

		year, _ := strconv.Atoi(match[1])
		number, _ := strconv.Atoi(match[2])

		if year < latestOfferYear {
			continue
		}

		if year > latestOfferYear {
			latestOfferYear = year
			latestOfferNo = number
			continue
		}

		if number < latestOfferNo {
			continue
		}
		if number == latestOfferNo {
			continue
		}
		latestOfferNo = number
	}

	if latestOfferYear < currentYear {
		return fmt.Sprintf("%d-001", currentYear)
	}

	return fmt.Sprintf("%d-%s", latestOfferYear, padWithZeros(latestOfferNo+1, 3))
}

func padWithZeros(input any, minLength int) string {
	var inputStr string

	switch v := input.(type) {
	case string:
		inputStr = v
	case int:
		inputStr = strconv.Itoa(v)
	case int64:
		inputStr = strconv.FormatInt(v, 10)
	case float64:
		inputStr = strconv.FormatFloat(v, 'f', -1, 64)
	default:
		return ""
	}

	for len(inputStr) < minLength {
		inputStr = "0" + inputStr
	}

	return inputStr
}

func (s *OffersServer) CreateEmptyOffer(ctx context.Context, req *connect.Request[offersv1.CreateEmptyOfferRequest]) (*connect.Response[offersv1.CreateEmptyOfferResponse], error) {
	now := time.Now()
	valid := time.Now().Add(24 * 8 * time.Hour)

	orgId, err := bson.ObjectIDFromHex(req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	offers, err := GetOffersByOrgId(ctx, req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	offer := DbOffer{
		Id:          bson.NewObjectID(),
		OfferNo:     getNextOfferNumber(offers),
		Note:        "",
		CustomerId:  "",
		Positions:   []DbPosition{},
		LegalNotice: "",
		Payment: DbPayment{
			Iban:     "",
			Bic:      "",
			BankName: "",
		},
		Discount: DbDiscount{
			Value: 0,
			Type:  int32(positionsv1.DiscountType_DISCOUNT_TYPE_FIXED.Number()),
		},
		DateOfIssue: now.Format("2006-01-02"),
		ValidUntil:  valid.Format("2006-01-02"),
		CreatedAt:   now.Unix(),
		UpdatedAt:   now.Unix(),
		OrgId:       orgId,
	}

	_, err = OFFERS.InsertOne(ctx, offer)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	o := offer.ToOffer()

	return connect.NewResponse(&offersv1.CreateEmptyOfferResponse{
		Offer: o,
	}), nil
}

func (s *OffersServer) GetOfferById(ctx context.Context, req *connect.Request[offersv1.GetOfferByIdRequest]) (*connect.Response[offersv1.GetOfferByIdResponse], error) {
	id, err := bson.ObjectIDFromHex(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{
		"_id": id,
	}

	var offer DbOffer

	if err := OFFERS.FindOne(ctx, filter).Decode(&offer); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	o := offer.ToOffer()

	return connect.NewResponse(&offersv1.GetOfferByIdResponse{
		Offer: o,
	}), nil
}

func (s *OffersServer) UpdateOffer(ctx context.Context, req *connect.Request[offersv1.UpdateOfferRequest]) (*connect.Response[offersv1.UpdateOfferResponse], error) {
	id, err := bson.ObjectIDFromHex(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{
		"_id": id,
	}

	positions := make([]DbPosition, len(req.Msg.Positions))

	for _, p := range req.Msg.Positions {
		positions = append(positions, DbPosition{
			Id:          bson.NewObjectID(),
			Name:        p.Name,
			Description: p.Description,
			Count:       p.Count,
			Price:       p.Price,
			Unit:        int32(p.Unit),
		})
	}

	now := time.Now().Unix()
	discount := DbDiscount{
		Value: req.Msg.Discount.Value,
		Type:  int32(req.Msg.Discount.Type),
	}

	offer := DbOffer{
		Id:          id,
		OfferNo:     req.Msg.OfferNo,
		Note:        req.Msg.Note,
		CustomerId:  req.Msg.CustomerId,
		LegalNotice: *req.Msg.LegalNotice,
		Payment: DbPayment{
			Iban:     req.Msg.Payment.Iban,
			BankName: req.Msg.Payment.BankName,
			Bic:      req.Msg.Payment.Bic,
		},
		Positions:   positions,
		Discount:    discount,
		UpdatedAt:   now,
		ValidUntil:  req.Msg.ValidUntil,
		DateOfIssue: req.Msg.DateOfIssue,
	}

	data := bson.M{
		"$set": offer,
	}

	updateResult, err := OFFERS.UpdateOne(ctx, filter, data)

	if updateResult.ModifiedCount == 0 {
		return nil, connect.NewError(connect.CodeInternal, errors.New("No documents were updated."))
	}

	currentOffer, err := GetOfferById(ctx, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&offersv1.UpdateOfferResponse{
		Offer: currentOffer,
	}), nil
}

func GenerateBlanko(offer *offersv1.Offer) ([]byte, error) {
	pdf := fpdf.New("P", "mm", "A4", "")
	tr := pdf.UnicodeTranslatorFromDescriptor("")

	title := tr("Anmeldung und Unterrichtsvertrag zum ....................")

	pdf.SetTitle(title, true)
	pdf.SetAuthor("Musicschool CML", true)
	pdf.SetHeaderFunc(func() {
		pdf.Image("logo.png", 10, 10, 0, 0, false, "", 0, "")
		pdf.SetFont("Arial", "B", 12)
		pdf.Text(180, 10, time.Now().Format("02.01.2006"))
	})
	pdf.AddPage()
	pdf.SetFont("Arial", "", 12)
	pdf.Text(20, 55, fmt.Sprintf("Instrument: %s", tr("..........................")))
	pdf.Text(110, 55, fmt.Sprintf("Lehrer: %s", tr("..........................")))
	pdf.Text(20, 61, fmt.Sprintf("%s: %s", tr("Schüler:in"), tr("..........................")))
	pdf.Text(110, 61, fmt.Sprintf("Geburtsdatum: %s", ".........................."))
	pdf.Text(20, 67, fmt.Sprintf("%s: %s", tr("Straße"), tr("............................")))
	pdf.Text(110, 67, fmt.Sprintf("PLZ: %s", ".........................."))
	pdf.Text(20, 73, fmt.Sprintf("Wohnort: %s", tr("..........................")))
	pdf.Text(110, 73, fmt.Sprintf("Erziehungsberechtigte: %s", tr("..........................")))
	pdf.Text(20, 79, fmt.Sprintf("Telefon: +49 %s", ".........................."))
	pdf.Text(110, 79, fmt.Sprintf("E-Mail: %s", "........................................"))

	lines := []string{
		"Die Musikschule übernimmt den regelmäßigen Unterricht des Schülers beginnend am ...........................",
		"Als Unterrichtsjahr gilt das Kalenderjahr. Der Unterricht wird als Lektion zu wöchentlich einmal ........",
		"Minuten erteilt, monatliche Gebühr = ...........,- Euro.",
		"Das Honorar wird als Jahreshonorar berechnet und ist in 12 gleichen Raten im Voraus bis zum 10.",
		"jeden Monats zu zahlen, einmalige Aufnahmegebühr: 20,- Euro. Der Unterricht kann nur an",
		"Schultagen erteilt werden. Bei Rücklastschriften berechnen wir 10,-€ pro nicht einlösbarer",
		"Lastschrift. Die erste Unterrichtsstunde ist ein Gratis-Probeunterricht, die vereinbarte Zeit gilt für alle folgenden",
		"Stunden. Will ein Schüler den Unterricht nach der kostenlosen Probestunde nicht fortsetzen, genügt",
		"eine entsprechende mündliche Mitteilung. Bei längerer Krankheit des Schülers entfällt das anteilige",
		"Honorar nach der vierten einander folgenden versäumten Stunde.",
		"Der Kurs kann von den Vertragspartnern mit sechswöchiger Frist zum 30.April/ 31.August/",
		"31.Dezember in schriftlicher Form gekündigt werden. Die Kündigung kann durch eine E-Mail",
		"erfolgen und muß vor Beginn der Kündigungsfrist bei o.g. Anschrift eingegangen sein. Eine",
		"Erhöhung des Honorars ist möglich und hat nach Grundsätzen der Billigkeit zu erfolgen. Sie muß",
		"mindestens 8 Wochen vorher dem Vertragspartner schriftlich mitgeteilt werden.",
		"Für vom Schüler versäumte oder abgesagte Stunden ist die Lehrkraft nicht nachleistungspflichtig,",
		"die anteilige Vergütung hierfür kann vom Honorar nicht abgezogen werden. Es besteht jedoch die",
		"Möglichkeit, in derselben Woche ersatzweise an einer anderen Unterrichtsstunde teilzunehmen,",
		"wenn die Lehrkraft im Falle ernsthafter Verhinderung mindestens 24 Stunden vorher davon",
		"Kenntnis erhalten hat. Aus anderen Gründen von der Lehrkraft abgesagte Stunden werden",
		"nachgegeben, ersatzweise wird das anteilige Honorar erstattet. Zahlungsweise: nur monatlich durch",
		"Einzugsverfahren. Änderungen und Ergänzungen des Vertrages sind nur wirksam, wenn sie",
		"schriftlich erfolgen. Werden einzelne Bestimmungen dieses Vertrages unwirksam, wird dadurch die",
		"Gültigkeit des Vertrages im Übrigen nicht berührt.",
	}

	y := 90.

	pdf.SetFont("Arial", "", 10)
	for _, line := range lines {
		pdf.Text(20, y, tr(line))
		y += 5
	}

	y += 10
	pdf.SetFont("Arial", "B", 11)
	pdf.Text(20, y, tr("Ermächtigung zum Einzug von Unterrichtsgebühren durch Lastschrift:"))

	y += 5
	pdf.SetFont("Arial", "", 11)
	pdf.Text(20, y, tr("Hiermit ermächtige ich Sie widerruflich, die von mir zu entrichtenden Unterrichtsgebühren"))
	y += 5
	pdf.Text(20, y, tr("beginnend ab ........................... bei Fälligkeit zu Lasten meines Kontos"))
	y += 7
	pdf.Text(20, y, tr("IBAN: ................................................................................"))
	y += 7
	pdf.Text(20, y, tr("durch Lastschrift einzuziehen. Wenn mein Konto die erforderliche Deckung nicht aufweist, besteht"))
	y += 5
	pdf.Text(20, y, tr("seitens des kontoführenden Kreditinstitutes keine Verpflichtung zur Einlösung."))
	y += 10
	pdf.Text(20, y, tr("......................................................"))
	pdf.Text(110, y, tr("........................................................................"))
	y += 5
	pdf.Text(20, y, tr("Ort, Datum"))
	pdf.Text(110, y, tr("Unterschrift Kontoinhaber"))
	y += 10
	pdf.Text(20, y, tr("........................................................................"))
	pdf.Text(110, y, tr("........................................................................"))
	y += 5
	pdf.Text(20, y, tr("Unterschrift Erziehungsberechtigte"))
	pdf.Text(110, y, tr("Unterschrift Musikschule CML"))

	var buffer bytes.Buffer
	err := pdf.Output(&buffer)

	if err != nil {
		return nil, err
	}

	return buffer.Bytes(), nil
}
