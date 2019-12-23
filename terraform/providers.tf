terraform {
  backend "s3" {
    bucket         = "mediacodex-terraform-state-dev"
    key            = "anime.tfstate"
    region         = "eu-west-2"
    encrypt        = true
    dynamodb_table = "mediacodex-terraform-lock-dev"
  }
}

provider "aws" {
  version = "~> 2.0"
  region  = "eu-west-2"
  allowed_account_ids = var.aws_allowed_accounts
}
