resource "aws_dynamodb_table" "anime" {
  name = "anime"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = merge(var.default_tags, {
    service = "anime"
  })
}