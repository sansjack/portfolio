---
title: Calling Python across the network with gRPC
date: 2024-11-04
summary: A Python gRPC server that rolls random numbers into Postgres.
repo: https://github.com/sansjack/grpc-rng
---

What if calling a function on another machine felt exactly like calling one in your own code? That's the promise of **gRPC**, Google's open-source framework for remote procedure calls. I built a small server to see how it feels in Python.

## What it does

One job, done properly: ask the server for a random number and it generates one, hands it back, and writes it to a Postgres database.

It's a deliberately tiny example, so the moving parts are easy to see.

## How it fits together

- **The contract.** Everything starts with a `rng.proto` file that describes the service and its messages.
- **Generated code.** `grpcio-tools` turns that proto file into Python modules the server builds on. The command lives in the `Makefile`, so it's just `make generate`.
- **The server.** It implements the service and stores a number in Postgres after every call.
- **The packaging.** Docker Compose runs the server next to its Postgres database as one small network.

## Poking it

To test it, I use [BloomRPC](https://github.com/bloomrpc/bloomrpc): import the proto file, hit a button, see a number. That's a testing convenience, though.

In the real world, a gRPC client would make these calls from your own services. The point of the whole exercise is that the client hands the work to the server and gets the result back. Voilà, compute offloaded.

---

## Run it locally

1. Install [BloomRPC](https://github.com/bloomrpc/bloomrpc) and import `rng.proto`.
2. Install Python (I'm on 3.12).
3. Run `make install`.
4. Run `make run`.

## Run it in Docker

1. Install [BloomRPC](https://github.com/bloomrpc/bloomrpc) and import `rng.proto`.
2. Copy `.env.example` to `.env`.
3. Run `make docker-run`, or `docker-compose up --build -d`.

## Then the fun part

Open BloomRPC, point it at `127.0.0.1:50051`, call the function, and watch the random numbers roll in.
