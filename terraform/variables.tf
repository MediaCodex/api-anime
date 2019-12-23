variable "default_tags" {
  type        = map(string)
  description = "Common resource tags for all resources"
  default = {
    Application = "MediaCodex"
    Service     = "Infrastructure"
  }
  # TODO: add stage
}

variable "aws_allowed_accounts" {
  type = list(string)
  default = [
    "022451593157"
  ]
}

