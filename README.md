## Reduce a PDF size

```
curl -v -F "density=300" -F "foo=@input.pdf" \
http://localhost:3000/upload --output output.pdf

```