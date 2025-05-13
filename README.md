# Welcome to LJ-Time!

## Protobuf

### Install Protobuf

[connectrpc docs](https://connectrpc.com/docs/go/getting-started)

```bash
go install github.com/bufbuild/buf/cmd/buf@latest
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
```

Make sure to have the following in your `PATH`:

```bash
$ [ -n "$(go env GOBIN)" ] && export PATH="$(go env GOBIN):${PATH}"
$ [ -n "$(go env GOPATH)" ] && export PATH="$(go env GOPATH)/bin:${PATH}"
```

### Generate Protobuf

```bash
protoc --go_out=. --go-grpc_out=. proto/**/*.proto
```

#### Macos

```bash
brew install protobuf
```

## Development

### Start React

```bash
npm run dev
```

### Start go

```bash
cd server
air
```

## Protobuf Files


## TODOS

### MVP

- Buchungsoption
- Jobs
- Leistungsarten
- Angebote
- Rechnungen
- Stundenzettel
- Urlaube
