package main

import "github.com/maxischmaxi/ljtime-api/invoices/v1/invoicesv1connect"

type InvoicesServer struct {
	invoicesv1connect.UnimplementedInvoicesServiceHandler
}
