terraform {
  backend "s3" {
    key            = "anime.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}

provider "aws" {
  version             = "~> 2.0"
  region              = "eu-central-1"
  allowed_account_ids = var.aws_allowed_accounts
  assume_role {
    role_arn = var.aws_assume_role
  }
}
