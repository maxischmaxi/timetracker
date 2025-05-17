package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"text/template"
	"time"

	orgv1 "github.com/maxischmaxi/ljtime-api/org/v1"
	"github.com/resend/resend-go/v2"
)

type SendOrgInviteData struct {
	Lang       string
	Id         string
	Token      string
	Org        *orgv1.Org
	InviteFrom string
}

type RenderTemplateResponse struct {
	Html string
	Text string
}

func renderTemplate(filename string, data any) (*RenderTemplateResponse, error) {
	htmlTmpl, err := template.ParseFiles(fmt.Sprintf("%s.html", filename))
	if err != nil {
		return nil, err
	}

	var htmlBuffer bytes.Buffer
	err = htmlTmpl.Execute(&htmlBuffer, data)
	if err != nil {
		return nil, err
	}

	txtTmpl, err := template.ParseFiles(fmt.Sprintf("%s.txt", filename))
	if err != nil {
		return nil, err
	}

	var txtBuffer bytes.Buffer
	err = txtTmpl.Execute(&txtBuffer, data)
	if err != nil {
		return nil, err
	}

	return &RenderTemplateResponse{
		Text: txtBuffer.String(),
		Html: htmlBuffer.String(),
	}, nil
}

func generateEmailInviteToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func SendOrgInvite(ctx context.Context, to []string, orgId string, userId string) (*resend.SendEmailResponse, error) {
	user, err := GetUserById(ctx, userId)
	if err != nil {
		return nil, err
	}

	org, err := GetOrgById(ctx, orgId)
	if err != nil {
		return nil, err
	}

	token, err := generateEmailInviteToken()
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	inv := OrgInvite{
		OrgId:     org.Id,
		Token:     token,
		CreatedAt: time.Now().Unix(),
	}

	if _, err = ORG_INVITE_TOKENS.InsertOne(ctx, inv); err != nil {
		return nil, err
	}

	data := &SendOrgInviteData{
		Lang:       user.Address.Country,
		Id:         org.Id,
		Token:      token,
		Org:        org,
		InviteFrom: user.Name,
	}

	content, err := renderTemplate("email-templates/org-invite", data)
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	params := &resend.SendEmailRequest{
		From:    "LJTime <info@mail.jeschek.dev>",
		To:      to,
		Html:    content.Html,
		Text:    content.Text,
		Subject: fmt.Sprintf("Invite from %s!", org.Name),
		ReplyTo: "info@ljtime.dev",
	}

	sent, err := resendClient.Emails.Send(params)
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	return sent, nil
}
