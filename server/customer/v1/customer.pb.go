// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.6
// 	protoc        (unknown)
// source: customer/v1/customer.proto

package customerv1

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
	unsafe "unsafe"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type Address struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Street        string                 `protobuf:"bytes,1,opt,name=street,proto3" json:"street,omitempty"`
	City          string                 `protobuf:"bytes,2,opt,name=city,proto3" json:"city,omitempty"`
	State         string                 `protobuf:"bytes,3,opt,name=state,proto3" json:"state,omitempty"`
	Zip           string                 `protobuf:"bytes,4,opt,name=zip,proto3" json:"zip,omitempty"`
	Country       string                 `protobuf:"bytes,5,opt,name=country,proto3" json:"country,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *Address) Reset() {
	*x = Address{}
	mi := &file_customer_v1_customer_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Address) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Address) ProtoMessage() {}

func (x *Address) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Address.ProtoReflect.Descriptor instead.
func (*Address) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{0}
}

func (x *Address) GetStreet() string {
	if x != nil {
		return x.Street
	}
	return ""
}

func (x *Address) GetCity() string {
	if x != nil {
		return x.City
	}
	return ""
}

func (x *Address) GetState() string {
	if x != nil {
		return x.State
	}
	return ""
}

func (x *Address) GetZip() string {
	if x != nil {
		return x.Zip
	}
	return ""
}

func (x *Address) GetCountry() string {
	if x != nil {
		return x.Country
	}
	return ""
}

type UpdateCustomer struct {
	state          protoimpl.MessageState `protogen:"open.v1"`
	Id             string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Tag            string                 `protobuf:"bytes,2,opt,name=tag,proto3" json:"tag,omitempty"`
	Name           string                 `protobuf:"bytes,3,opt,name=name,proto3" json:"name,omitempty"`
	Email          string                 `protobuf:"bytes,4,opt,name=email,proto3" json:"email,omitempty"`
	Phone          string                 `protobuf:"bytes,5,opt,name=phone,proto3" json:"phone,omitempty"`
	Address        *Address               `protobuf:"bytes,6,opt,name=address,proto3" json:"address,omitempty"`
	ServiceTypeIds []string               `protobuf:"bytes,7,rep,name=service_type_ids,json=serviceTypeIds,proto3" json:"service_type_ids,omitempty"`
	unknownFields  protoimpl.UnknownFields
	sizeCache      protoimpl.SizeCache
}

func (x *UpdateCustomer) Reset() {
	*x = UpdateCustomer{}
	mi := &file_customer_v1_customer_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpdateCustomer) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpdateCustomer) ProtoMessage() {}

func (x *UpdateCustomer) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpdateCustomer.ProtoReflect.Descriptor instead.
func (*UpdateCustomer) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{1}
}

func (x *UpdateCustomer) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *UpdateCustomer) GetTag() string {
	if x != nil {
		return x.Tag
	}
	return ""
}

func (x *UpdateCustomer) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *UpdateCustomer) GetEmail() string {
	if x != nil {
		return x.Email
	}
	return ""
}

func (x *UpdateCustomer) GetPhone() string {
	if x != nil {
		return x.Phone
	}
	return ""
}

func (x *UpdateCustomer) GetAddress() *Address {
	if x != nil {
		return x.Address
	}
	return nil
}

func (x *UpdateCustomer) GetServiceTypeIds() []string {
	if x != nil {
		return x.ServiceTypeIds
	}
	return nil
}

type Customer struct {
	state          protoimpl.MessageState `protogen:"open.v1"`
	Id             string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name           string                 `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	Email          string                 `protobuf:"bytes,3,opt,name=email,proto3" json:"email,omitempty"`
	Phone          string                 `protobuf:"bytes,4,opt,name=phone,proto3" json:"phone,omitempty"`
	Tag            string                 `protobuf:"bytes,5,opt,name=tag,proto3" json:"tag,omitempty"`
	OrgId          string                 `protobuf:"bytes,6,opt,name=org_id,json=orgId,proto3" json:"org_id,omitempty"`
	CreatedAt      int64                  `protobuf:"varint,7,opt,name=created_at,json=createdAt,proto3" json:"created_at,omitempty"`
	UpdatedAt      int64                  `protobuf:"varint,8,opt,name=updated_at,json=updatedAt,proto3" json:"updated_at,omitempty"`
	Address        *Address               `protobuf:"bytes,9,opt,name=address,proto3" json:"address,omitempty"`
	ServiceTypeIds []string               `protobuf:"bytes,10,rep,name=service_type_ids,json=serviceTypeIds,proto3" json:"service_type_ids,omitempty"`
	unknownFields  protoimpl.UnknownFields
	sizeCache      protoimpl.SizeCache
}

func (x *Customer) Reset() {
	*x = Customer{}
	mi := &file_customer_v1_customer_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *Customer) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Customer) ProtoMessage() {}

func (x *Customer) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Customer.ProtoReflect.Descriptor instead.
func (*Customer) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{2}
}

func (x *Customer) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Customer) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *Customer) GetEmail() string {
	if x != nil {
		return x.Email
	}
	return ""
}

func (x *Customer) GetPhone() string {
	if x != nil {
		return x.Phone
	}
	return ""
}

func (x *Customer) GetTag() string {
	if x != nil {
		return x.Tag
	}
	return ""
}

func (x *Customer) GetOrgId() string {
	if x != nil {
		return x.OrgId
	}
	return ""
}

func (x *Customer) GetCreatedAt() int64 {
	if x != nil {
		return x.CreatedAt
	}
	return 0
}

func (x *Customer) GetUpdatedAt() int64 {
	if x != nil {
		return x.UpdatedAt
	}
	return 0
}

func (x *Customer) GetAddress() *Address {
	if x != nil {
		return x.Address
	}
	return nil
}

func (x *Customer) GetServiceTypeIds() []string {
	if x != nil {
		return x.ServiceTypeIds
	}
	return nil
}

type CreateCustomer struct {
	state          protoimpl.MessageState `protogen:"open.v1"`
	Tag            string                 `protobuf:"bytes,1,opt,name=tag,proto3" json:"tag,omitempty"`
	Name           string                 `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	Email          string                 `protobuf:"bytes,3,opt,name=email,proto3" json:"email,omitempty"`
	Phone          string                 `protobuf:"bytes,4,opt,name=phone,proto3" json:"phone,omitempty"`
	Address        *Address               `protobuf:"bytes,5,opt,name=address,proto3" json:"address,omitempty"`
	ServiceTypeIds []string               `protobuf:"bytes,6,rep,name=service_type_ids,json=serviceTypeIds,proto3" json:"service_type_ids,omitempty"`
	unknownFields  protoimpl.UnknownFields
	sizeCache      protoimpl.SizeCache
}

func (x *CreateCustomer) Reset() {
	*x = CreateCustomer{}
	mi := &file_customer_v1_customer_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *CreateCustomer) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CreateCustomer) ProtoMessage() {}

func (x *CreateCustomer) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CreateCustomer.ProtoReflect.Descriptor instead.
func (*CreateCustomer) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{3}
}

func (x *CreateCustomer) GetTag() string {
	if x != nil {
		return x.Tag
	}
	return ""
}

func (x *CreateCustomer) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *CreateCustomer) GetEmail() string {
	if x != nil {
		return x.Email
	}
	return ""
}

func (x *CreateCustomer) GetPhone() string {
	if x != nil {
		return x.Phone
	}
	return ""
}

func (x *CreateCustomer) GetAddress() *Address {
	if x != nil {
		return x.Address
	}
	return nil
}

func (x *CreateCustomer) GetServiceTypeIds() []string {
	if x != nil {
		return x.ServiceTypeIds
	}
	return nil
}

type GetCustomerRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetCustomerRequest) Reset() {
	*x = GetCustomerRequest{}
	mi := &file_customer_v1_customer_proto_msgTypes[4]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetCustomerRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCustomerRequest) ProtoMessage() {}

func (x *GetCustomerRequest) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[4]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCustomerRequest.ProtoReflect.Descriptor instead.
func (*GetCustomerRequest) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{4}
}

func (x *GetCustomerRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type GetCustomerResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Customer      *Customer              `protobuf:"bytes,1,opt,name=customer,proto3" json:"customer,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetCustomerResponse) Reset() {
	*x = GetCustomerResponse{}
	mi := &file_customer_v1_customer_proto_msgTypes[5]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetCustomerResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCustomerResponse) ProtoMessage() {}

func (x *GetCustomerResponse) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[5]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCustomerResponse.ProtoReflect.Descriptor instead.
func (*GetCustomerResponse) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{5}
}

func (x *GetCustomerResponse) GetCustomer() *Customer {
	if x != nil {
		return x.Customer
	}
	return nil
}

type CreateCustomerRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Customer      *CreateCustomer        `protobuf:"bytes,1,opt,name=customer,proto3" json:"customer,omitempty"`
	OrgId         string                 `protobuf:"bytes,2,opt,name=org_id,json=orgId,proto3" json:"org_id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *CreateCustomerRequest) Reset() {
	*x = CreateCustomerRequest{}
	mi := &file_customer_v1_customer_proto_msgTypes[6]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *CreateCustomerRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CreateCustomerRequest) ProtoMessage() {}

func (x *CreateCustomerRequest) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[6]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CreateCustomerRequest.ProtoReflect.Descriptor instead.
func (*CreateCustomerRequest) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{6}
}

func (x *CreateCustomerRequest) GetCustomer() *CreateCustomer {
	if x != nil {
		return x.Customer
	}
	return nil
}

func (x *CreateCustomerRequest) GetOrgId() string {
	if x != nil {
		return x.OrgId
	}
	return ""
}

type CreateCustomerResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Customer      *Customer              `protobuf:"bytes,1,opt,name=customer,proto3" json:"customer,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *CreateCustomerResponse) Reset() {
	*x = CreateCustomerResponse{}
	mi := &file_customer_v1_customer_proto_msgTypes[7]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *CreateCustomerResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CreateCustomerResponse) ProtoMessage() {}

func (x *CreateCustomerResponse) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[7]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CreateCustomerResponse.ProtoReflect.Descriptor instead.
func (*CreateCustomerResponse) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{7}
}

func (x *CreateCustomerResponse) GetCustomer() *Customer {
	if x != nil {
		return x.Customer
	}
	return nil
}

type UpdateCustomerRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Customer      *UpdateCustomer        `protobuf:"bytes,1,opt,name=customer,proto3" json:"customer,omitempty"`
	OrgId         string                 `protobuf:"bytes,2,opt,name=org_id,json=orgId,proto3" json:"org_id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpdateCustomerRequest) Reset() {
	*x = UpdateCustomerRequest{}
	mi := &file_customer_v1_customer_proto_msgTypes[8]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpdateCustomerRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpdateCustomerRequest) ProtoMessage() {}

func (x *UpdateCustomerRequest) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[8]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpdateCustomerRequest.ProtoReflect.Descriptor instead.
func (*UpdateCustomerRequest) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{8}
}

func (x *UpdateCustomerRequest) GetCustomer() *UpdateCustomer {
	if x != nil {
		return x.Customer
	}
	return nil
}

func (x *UpdateCustomerRequest) GetOrgId() string {
	if x != nil {
		return x.OrgId
	}
	return ""
}

type UpdateCustomerResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UpdateCustomerResponse) Reset() {
	*x = UpdateCustomerResponse{}
	mi := &file_customer_v1_customer_proto_msgTypes[9]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UpdateCustomerResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UpdateCustomerResponse) ProtoMessage() {}

func (x *UpdateCustomerResponse) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[9]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UpdateCustomerResponse.ProtoReflect.Descriptor instead.
func (*UpdateCustomerResponse) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{9}
}

type DeleteCustomerRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *DeleteCustomerRequest) Reset() {
	*x = DeleteCustomerRequest{}
	mi := &file_customer_v1_customer_proto_msgTypes[10]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *DeleteCustomerRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DeleteCustomerRequest) ProtoMessage() {}

func (x *DeleteCustomerRequest) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[10]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DeleteCustomerRequest.ProtoReflect.Descriptor instead.
func (*DeleteCustomerRequest) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{10}
}

func (x *DeleteCustomerRequest) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type DeleteCustomerResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Id            string                 `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *DeleteCustomerResponse) Reset() {
	*x = DeleteCustomerResponse{}
	mi := &file_customer_v1_customer_proto_msgTypes[11]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *DeleteCustomerResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DeleteCustomerResponse) ProtoMessage() {}

func (x *DeleteCustomerResponse) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[11]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DeleteCustomerResponse.ProtoReflect.Descriptor instead.
func (*DeleteCustomerResponse) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{11}
}

func (x *DeleteCustomerResponse) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

type GetCustomersRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetCustomersRequest) Reset() {
	*x = GetCustomersRequest{}
	mi := &file_customer_v1_customer_proto_msgTypes[12]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetCustomersRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCustomersRequest) ProtoMessage() {}

func (x *GetCustomersRequest) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[12]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCustomersRequest.ProtoReflect.Descriptor instead.
func (*GetCustomersRequest) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{12}
}

type GetCustomersResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Customers     []*Customer            `protobuf:"bytes,1,rep,name=customers,proto3" json:"customers,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetCustomersResponse) Reset() {
	*x = GetCustomersResponse{}
	mi := &file_customer_v1_customer_proto_msgTypes[13]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetCustomersResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCustomersResponse) ProtoMessage() {}

func (x *GetCustomersResponse) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[13]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCustomersResponse.ProtoReflect.Descriptor instead.
func (*GetCustomersResponse) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{13}
}

func (x *GetCustomersResponse) GetCustomers() []*Customer {
	if x != nil {
		return x.Customers
	}
	return nil
}

type GetCustomersByOrgRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	OrgId         string                 `protobuf:"bytes,1,opt,name=org_id,json=orgId,proto3" json:"org_id,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetCustomersByOrgRequest) Reset() {
	*x = GetCustomersByOrgRequest{}
	mi := &file_customer_v1_customer_proto_msgTypes[14]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetCustomersByOrgRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCustomersByOrgRequest) ProtoMessage() {}

func (x *GetCustomersByOrgRequest) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[14]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCustomersByOrgRequest.ProtoReflect.Descriptor instead.
func (*GetCustomersByOrgRequest) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{14}
}

func (x *GetCustomersByOrgRequest) GetOrgId() string {
	if x != nil {
		return x.OrgId
	}
	return ""
}

type GetCustomersByOrgResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Customers     []*Customer            `protobuf:"bytes,1,rep,name=customers,proto3" json:"customers,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *GetCustomersByOrgResponse) Reset() {
	*x = GetCustomersByOrgResponse{}
	mi := &file_customer_v1_customer_proto_msgTypes[15]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *GetCustomersByOrgResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetCustomersByOrgResponse) ProtoMessage() {}

func (x *GetCustomersByOrgResponse) ProtoReflect() protoreflect.Message {
	mi := &file_customer_v1_customer_proto_msgTypes[15]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetCustomersByOrgResponse.ProtoReflect.Descriptor instead.
func (*GetCustomersByOrgResponse) Descriptor() ([]byte, []int) {
	return file_customer_v1_customer_proto_rawDescGZIP(), []int{15}
}

func (x *GetCustomersByOrgResponse) GetCustomers() []*Customer {
	if x != nil {
		return x.Customers
	}
	return nil
}

var File_customer_v1_customer_proto protoreflect.FileDescriptor

const file_customer_v1_customer_proto_rawDesc = "" +
	"\n" +
	"\x1acustomer/v1/customer.proto\x12\vcustomer.v1\"w\n" +
	"\aAddress\x12\x16\n" +
	"\x06street\x18\x01 \x01(\tR\x06street\x12\x12\n" +
	"\x04city\x18\x02 \x01(\tR\x04city\x12\x14\n" +
	"\x05state\x18\x03 \x01(\tR\x05state\x12\x10\n" +
	"\x03zip\x18\x04 \x01(\tR\x03zip\x12\x18\n" +
	"\acountry\x18\x05 \x01(\tR\acountry\"\xcc\x01\n" +
	"\x0eUpdateCustomer\x12\x0e\n" +
	"\x02id\x18\x01 \x01(\tR\x02id\x12\x10\n" +
	"\x03tag\x18\x02 \x01(\tR\x03tag\x12\x12\n" +
	"\x04name\x18\x03 \x01(\tR\x04name\x12\x14\n" +
	"\x05email\x18\x04 \x01(\tR\x05email\x12\x14\n" +
	"\x05phone\x18\x05 \x01(\tR\x05phone\x12.\n" +
	"\aaddress\x18\x06 \x01(\v2\x14.customer.v1.AddressR\aaddress\x12(\n" +
	"\x10service_type_ids\x18\a \x03(\tR\x0eserviceTypeIds\"\x9b\x02\n" +
	"\bCustomer\x12\x0e\n" +
	"\x02id\x18\x01 \x01(\tR\x02id\x12\x12\n" +
	"\x04name\x18\x02 \x01(\tR\x04name\x12\x14\n" +
	"\x05email\x18\x03 \x01(\tR\x05email\x12\x14\n" +
	"\x05phone\x18\x04 \x01(\tR\x05phone\x12\x10\n" +
	"\x03tag\x18\x05 \x01(\tR\x03tag\x12\x15\n" +
	"\x06org_id\x18\x06 \x01(\tR\x05orgId\x12\x1d\n" +
	"\n" +
	"created_at\x18\a \x01(\x03R\tcreatedAt\x12\x1d\n" +
	"\n" +
	"updated_at\x18\b \x01(\x03R\tupdatedAt\x12.\n" +
	"\aaddress\x18\t \x01(\v2\x14.customer.v1.AddressR\aaddress\x12(\n" +
	"\x10service_type_ids\x18\n" +
	" \x03(\tR\x0eserviceTypeIds\"\xbc\x01\n" +
	"\x0eCreateCustomer\x12\x10\n" +
	"\x03tag\x18\x01 \x01(\tR\x03tag\x12\x12\n" +
	"\x04name\x18\x02 \x01(\tR\x04name\x12\x14\n" +
	"\x05email\x18\x03 \x01(\tR\x05email\x12\x14\n" +
	"\x05phone\x18\x04 \x01(\tR\x05phone\x12.\n" +
	"\aaddress\x18\x05 \x01(\v2\x14.customer.v1.AddressR\aaddress\x12(\n" +
	"\x10service_type_ids\x18\x06 \x03(\tR\x0eserviceTypeIds\"$\n" +
	"\x12GetCustomerRequest\x12\x0e\n" +
	"\x02id\x18\x01 \x01(\tR\x02id\"H\n" +
	"\x13GetCustomerResponse\x121\n" +
	"\bcustomer\x18\x01 \x01(\v2\x15.customer.v1.CustomerR\bcustomer\"g\n" +
	"\x15CreateCustomerRequest\x127\n" +
	"\bcustomer\x18\x01 \x01(\v2\x1b.customer.v1.CreateCustomerR\bcustomer\x12\x15\n" +
	"\x06org_id\x18\x02 \x01(\tR\x05orgId\"K\n" +
	"\x16CreateCustomerResponse\x121\n" +
	"\bcustomer\x18\x01 \x01(\v2\x15.customer.v1.CustomerR\bcustomer\"g\n" +
	"\x15UpdateCustomerRequest\x127\n" +
	"\bcustomer\x18\x01 \x01(\v2\x1b.customer.v1.UpdateCustomerR\bcustomer\x12\x15\n" +
	"\x06org_id\x18\x02 \x01(\tR\x05orgId\"\x18\n" +
	"\x16UpdateCustomerResponse\"'\n" +
	"\x15DeleteCustomerRequest\x12\x0e\n" +
	"\x02id\x18\x01 \x01(\tR\x02id\"(\n" +
	"\x16DeleteCustomerResponse\x12\x0e\n" +
	"\x02id\x18\x01 \x01(\tR\x02id\"\x15\n" +
	"\x13GetCustomersRequest\"K\n" +
	"\x14GetCustomersResponse\x123\n" +
	"\tcustomers\x18\x01 \x03(\v2\x15.customer.v1.CustomerR\tcustomers\"1\n" +
	"\x18GetCustomersByOrgRequest\x12\x15\n" +
	"\x06org_id\x18\x01 \x01(\tR\x05orgId\"P\n" +
	"\x19GetCustomersByOrgResponse\x123\n" +
	"\tcustomers\x18\x01 \x03(\v2\x15.customer.v1.CustomerR\tcustomers2\xad\x04\n" +
	"\x0fCustomerService\x12P\n" +
	"\vGetCustomer\x12\x1f.customer.v1.GetCustomerRequest\x1a .customer.v1.GetCustomerResponse\x12Y\n" +
	"\x0eCreateCustomer\x12\".customer.v1.CreateCustomerRequest\x1a#.customer.v1.CreateCustomerResponse\x12Y\n" +
	"\x0eUpdateCustomer\x12\".customer.v1.UpdateCustomerRequest\x1a#.customer.v1.UpdateCustomerResponse\x12Y\n" +
	"\x0eDeleteCustomer\x12\".customer.v1.DeleteCustomerRequest\x1a#.customer.v1.DeleteCustomerResponse\x12S\n" +
	"\fGetCustomers\x12 .customer.v1.GetCustomersRequest\x1a!.customer.v1.GetCustomersResponse\x12b\n" +
	"\x11GetCustomersByOrg\x12%.customer.v1.GetCustomersByOrgRequest\x1a&.customer.v1.GetCustomersByOrgResponseB:Z8github.com/maxischmaxi/ljtime-api/customer/v1;customerv1b\x06proto3"

var (
	file_customer_v1_customer_proto_rawDescOnce sync.Once
	file_customer_v1_customer_proto_rawDescData []byte
)

func file_customer_v1_customer_proto_rawDescGZIP() []byte {
	file_customer_v1_customer_proto_rawDescOnce.Do(func() {
		file_customer_v1_customer_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_customer_v1_customer_proto_rawDesc), len(file_customer_v1_customer_proto_rawDesc)))
	})
	return file_customer_v1_customer_proto_rawDescData
}

var file_customer_v1_customer_proto_msgTypes = make([]protoimpl.MessageInfo, 16)
var file_customer_v1_customer_proto_goTypes = []any{
	(*Address)(nil),                   // 0: customer.v1.Address
	(*UpdateCustomer)(nil),            // 1: customer.v1.UpdateCustomer
	(*Customer)(nil),                  // 2: customer.v1.Customer
	(*CreateCustomer)(nil),            // 3: customer.v1.CreateCustomer
	(*GetCustomerRequest)(nil),        // 4: customer.v1.GetCustomerRequest
	(*GetCustomerResponse)(nil),       // 5: customer.v1.GetCustomerResponse
	(*CreateCustomerRequest)(nil),     // 6: customer.v1.CreateCustomerRequest
	(*CreateCustomerResponse)(nil),    // 7: customer.v1.CreateCustomerResponse
	(*UpdateCustomerRequest)(nil),     // 8: customer.v1.UpdateCustomerRequest
	(*UpdateCustomerResponse)(nil),    // 9: customer.v1.UpdateCustomerResponse
	(*DeleteCustomerRequest)(nil),     // 10: customer.v1.DeleteCustomerRequest
	(*DeleteCustomerResponse)(nil),    // 11: customer.v1.DeleteCustomerResponse
	(*GetCustomersRequest)(nil),       // 12: customer.v1.GetCustomersRequest
	(*GetCustomersResponse)(nil),      // 13: customer.v1.GetCustomersResponse
	(*GetCustomersByOrgRequest)(nil),  // 14: customer.v1.GetCustomersByOrgRequest
	(*GetCustomersByOrgResponse)(nil), // 15: customer.v1.GetCustomersByOrgResponse
}
var file_customer_v1_customer_proto_depIdxs = []int32{
	0,  // 0: customer.v1.UpdateCustomer.address:type_name -> customer.v1.Address
	0,  // 1: customer.v1.Customer.address:type_name -> customer.v1.Address
	0,  // 2: customer.v1.CreateCustomer.address:type_name -> customer.v1.Address
	2,  // 3: customer.v1.GetCustomerResponse.customer:type_name -> customer.v1.Customer
	3,  // 4: customer.v1.CreateCustomerRequest.customer:type_name -> customer.v1.CreateCustomer
	2,  // 5: customer.v1.CreateCustomerResponse.customer:type_name -> customer.v1.Customer
	1,  // 6: customer.v1.UpdateCustomerRequest.customer:type_name -> customer.v1.UpdateCustomer
	2,  // 7: customer.v1.GetCustomersResponse.customers:type_name -> customer.v1.Customer
	2,  // 8: customer.v1.GetCustomersByOrgResponse.customers:type_name -> customer.v1.Customer
	4,  // 9: customer.v1.CustomerService.GetCustomer:input_type -> customer.v1.GetCustomerRequest
	6,  // 10: customer.v1.CustomerService.CreateCustomer:input_type -> customer.v1.CreateCustomerRequest
	8,  // 11: customer.v1.CustomerService.UpdateCustomer:input_type -> customer.v1.UpdateCustomerRequest
	10, // 12: customer.v1.CustomerService.DeleteCustomer:input_type -> customer.v1.DeleteCustomerRequest
	12, // 13: customer.v1.CustomerService.GetCustomers:input_type -> customer.v1.GetCustomersRequest
	14, // 14: customer.v1.CustomerService.GetCustomersByOrg:input_type -> customer.v1.GetCustomersByOrgRequest
	5,  // 15: customer.v1.CustomerService.GetCustomer:output_type -> customer.v1.GetCustomerResponse
	7,  // 16: customer.v1.CustomerService.CreateCustomer:output_type -> customer.v1.CreateCustomerResponse
	9,  // 17: customer.v1.CustomerService.UpdateCustomer:output_type -> customer.v1.UpdateCustomerResponse
	11, // 18: customer.v1.CustomerService.DeleteCustomer:output_type -> customer.v1.DeleteCustomerResponse
	13, // 19: customer.v1.CustomerService.GetCustomers:output_type -> customer.v1.GetCustomersResponse
	15, // 20: customer.v1.CustomerService.GetCustomersByOrg:output_type -> customer.v1.GetCustomersByOrgResponse
	15, // [15:21] is the sub-list for method output_type
	9,  // [9:15] is the sub-list for method input_type
	9,  // [9:9] is the sub-list for extension type_name
	9,  // [9:9] is the sub-list for extension extendee
	0,  // [0:9] is the sub-list for field type_name
}

func init() { file_customer_v1_customer_proto_init() }
func file_customer_v1_customer_proto_init() {
	if File_customer_v1_customer_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_customer_v1_customer_proto_rawDesc), len(file_customer_v1_customer_proto_rawDesc)),
			NumEnums:      0,
			NumMessages:   16,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_customer_v1_customer_proto_goTypes,
		DependencyIndexes: file_customer_v1_customer_proto_depIdxs,
		MessageInfos:      file_customer_v1_customer_proto_msgTypes,
	}.Build()
	File_customer_v1_customer_proto = out.File
	file_customer_v1_customer_proto_goTypes = nil
	file_customer_v1_customer_proto_depIdxs = nil
}
