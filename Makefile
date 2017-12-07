push: build
	docker push prdog/prdog:latest

build:
	docker build -t prdog/prdog:latest .
