resource "aws_lambda_function" "http_show" {
  function_name = "anime-http-show"
  role          = aws_iam_role.lambda_http_show.arn

  // handler
  source_code_hash = filebase64sha256("../build/http-show.zip")
  filename         = "../build/http-show.zip"
  handler          = "http-show.default"

  // runtime
  runtime = "nodejs12.x"

  tags = var.default_tags
}

resource "aws_iam_role" "lambda_http_show" {
  name               = "anime-http-show"
  path               = "/lambda/"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

module "lambda_http_show_dynamodb" {
  source = "./modules/iam-dynamodb"
  role   = aws_iam_role.lambda_http_show.id
  table  = aws_dynamodb_table.anime.arn
  read   = true
}
