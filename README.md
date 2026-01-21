replace(
  outputs('Compose-body'),
  '{{IMAGE_HERE}}',
  concat(
    '<img src="data:image/jpeg;base64,',
    body('Get-file-content-image'),
    '" width="700" />'
  )
)
