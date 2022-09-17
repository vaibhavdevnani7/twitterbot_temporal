import { TwitterApi } from 'twitter-api-v2';
var nodemailer = require('nodemailer');
export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

export async function top_tweets(id: string): Promise<any> {
  const twitterClient = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAMcSZAEAAAAA0DvcHjWeJKDEOmPd4jgI%2FnJUgCk%3Di72hOLXEmoaSZQMFsHWExZMiWdomK2EqPLG4gYiOJCmKYyQ3Od');
  const tweetsOfJack = await twitterClient.v2.userTimeline(id, { exclude: 'replies', max_results: 100, "tweet.fields": 'public_metrics'});
  var tweets = tweetsOfJack.tweets;
  while (!tweetsOfJack.done) {
    await tweetsOfJack.fetchNext();
    tweets.concat(tweetsOfJack.tweets)
  }
  console.log(typeof tweets);
  tweets = tweets.sort((a,b) => (b.public_metrics!.like_count - a.public_metrics!.like_count));
  console.log(tweets);
  return tweets.slice(0,10);
}


export async function send_email(tweets: any): Promise<any>{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'f20212676@pilani.bits-pilani.ac.in',
      pass: 'xyskmhshncdbjddj'
    }
  });

  var mailOptions = {
    from: 'f20212676@pilani.bits-pilani.ac.in',
    to: 'vaibhavdevnani7@gmail.com',
    subject: 'Sending Email using Node.js',
    html: tweets
  };

  transporter.sendMail(mailOptions, function(error:any , info:any ){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  return 'success';
}
