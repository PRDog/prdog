IMAGE=prdog/prdog

push: build
	docker push prdog/prdog:latest

build:
	docker build -t $(IMAGE) .

shell: build
	docker run -it -p 3000:3000 -v $(shell pwd):/prdog $(IMAGE) /bin/sh