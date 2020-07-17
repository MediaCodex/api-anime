resource "aws_lambda_function" "http_index" {
  function_name = "anime-http-index"
  role          = aws_iam_role.lambda_http_index.arn

  // handler
  source_code_hash = filebase64sha256("../build/http-index.zip")
  filename         = "../build/http-index.zip"
  handler          = "http-index.default"

  // runtime
  runtime = "nodejs12.x"

  tags = var.default_tags
}

resource "aws_iam_role" "lambda_http_index" {
  name               = "anime-http-index"
  path               = "/lambda/"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

module "lambda_http_index_dynamodb" {
  source = "./modules/iam-dynamodb"
  role   = aws_iam_role.lambda_http_index.id
  table  = aws_dynamodb_table.anime.arn
  read   = true
}
