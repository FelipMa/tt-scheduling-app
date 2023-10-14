class Schedule {
  public targetDate: string;
  public text: string;
  public reply: string;
  public media: string;
  public status: string;
  public accountUsername: string;

  constructor(
    targetDate: string,
    text: string,
    reply: string,
    media: string | File,
    accountUsername: string
  ) {
    this.targetDate = targetDate;
    this.text = text;
    this.reply = reply;
    if (typeof media === "string") {
      this.media = media;
    } else {
      this.media = media.name;
    }
    this.status = "Agendado";
    this.accountUsername = accountUsername;
  }
}

export default Schedule;
