---
layout: post
title: "Guest Post: Why Easy Encryption Is Safe Encryption"
date: 2017-11-18
author: Sam Bocetta
authorlink: https://twitter.com/sambocetta
authorimg: https://pbs.twimg.com/profile_images/899554966339244032/kYfKqA_f_400x400.jpg
notice: This is a guest post by Sam Bocetta.
tags: [other, guest]
stylesheets: ['/css/blog-post.css']

published: true
language: en

sitemap: false
---
Another day, another data breach. Two weeks ago, the <a href="http://www.canberratimes.com.au/national/public-service/data-breach-sees-records-of-50000-australian-workers-exposed-20171102-gzdef3.html" target="_blank">headline news</a> in Australia was that some 50,000 workers had their personal records exposed. And just as every summer now inevitably becomes the hottest on record, every data breach is always the largest in history. This is certainly the case here – such a scale of data loss is unprecedented in Australia, if not elsewhere.

The breach is also typical in another way: it was caused by human error. Several government agencies had been working with a "third party contractor", and it was this company who were responsible for the leak. They remain unnamed, which is lucky for them, given the reputational damage that can be caused by breaches like this.

On a practical level, the leak was caused by … drum roll please … an incorrectly configured cloud storage service. Sounds familiar, right?

And whilst I don't know precisely what "incorrectly configured" means in this particular context, I can make a good guess. My bet would be that the data in the cloud was not encrypted, or at least was not encrypted in transit to the cloud.

Further, I assume that whichever "third party contractor" we are dealing with here had policies that required employees to encrypt data before sending it anywhere. They were dealing with sensitive records, after all, and anything else would have been remiss.

## Human Error
This might sound like idle speculation, but I raise it to make a serious point: <a href="https://www.dataprivacymonitor.com/cybersecurity/deeper-dive-human-error-is-to-blame-for-most-breaches/" target="_blank">the majority of data breaches are caused by human error</a>. Research by Data Privacy Monitor found that in 2015, 37% of <a href="http://e.bakerlaw.com/s/916f16a49296140a9d10ee92cc567ebd16e76582" target="_blank">data loss was the direct cause of human error</a>. And it gets worse – if you broaden the definition of "error" to include falling for phishing scams, fully 59% of all data breaches fall into this category.

In fact, it could be argued that almost all incidents of data breach are the result of human error. The other categories mentioned in the same research are (24%), external theft (17%), vendors (14%), internal theft (8%), and lost or improper disposal (6%). Barring internal theft, pretty much all of these categories rely on human error: external theft is made possible by employees leaving their laptops on trains, and by not having them encrypted, for instance.

Given this, it's not surprising that analyses of the <a href="https://www.venafi.com/blog/7-data-breaches-caused-human-error-did-encryption-play-role" target="_blank">biggest data breaches in recent years</a> have pointed to the role of human error. In most cases, a phishing attack is used to gain access to protected data, but in a sizeable minority the problem is simply that once basic access to a system is achieved, an attacker has access to everything, because nothing is encrypted.

## Human Ignorance
I don't mean to suggest that everybody is stupid, or that it is easy to spot a sophisticated phishing attack. Even many of Sony's top executives <a href="https://www.tripwire.com/state-of-security/latest-security-news/sony-hackers-used-phishing-emails-to-breach-company-networks/" target="_blank">fell foul of such an attack</a>, of course, back in 2014.

Instead, the problem lies with the generally poor level of knowledge on security issues, and nowhere is this more apparent than when it comes to encryption. If you work in tech, it's easy to forget that people don't understand encryption, despite the innumerable and <a href="https://thebestvpn.com/cryptography/" target="_blank">excellent guides</a> available.

<div class="img-caption">
  <img class="img-responsive" src="https://imgs.xkcd.com/comics/pgp.png" srcset="https://imgs.xkcd.com/comics/pgp.png 1x, https://imgs.xkcd.com/comics/pgp_2x.png 2x" title="If you want to be extra safe, check that there's a big block of jumbled characters at the bottom." alt="PGP"/>
  <p>Illustration by <a href="https://xkcd.com/1181/" target="_blank">Randall Munroe (xkcd)</a></p>
</div>

In my experience, the majority of employees (and perhaps people) fall into two categories. There are those that think that their because they need to enter a Gmail password (sometimes), all their emails are safe as long as they keep their password secret. Or maybe just share it with a few friends.

Then there are those, more nihilistic, who figure that the government / hackers / the illuminati / whoever can see everything that is happening anyway, so security is pointless in any case. I remember that several friends were amazed <a href="https://www.macrumors.com/2017/10/23/fbi-unable-to-crack-6900-devices/" target="_blank">when the FBI couldn't get into encrypted iPhones</a> a few years ago – they had assumed that the government could _always_ get around _every_ security feature.

This type of person is more difficult to encourage into good security habits, but the approach for both types of people should be the same.

## Make Encryption Simple
I'll let you into a little secret: I don't encrypt all my emails. Some, sure. But if I'm just writing to my mother about Christmas, I don't bother: call me lazy, but it's just too much hassle.

My personal files are a different matter. I'm still amazed by people who say something along the lines of "I've got nothing to hide, so it doesn't matter if someone hacks my computer". You don't have to be a dissident in an oppressive regime to be damaged by a data leak. Emails, purchasing history, even your contact list, can easily be used to impersonate you online, even if there is no incriminating data there.

There are endless guides about how to encourage employees, friends, your gran, to store and send data safely. Many point out that proper training and education can bring home to people the importance of encryption. This might be true, but to my mind the most factor in getting people to use encryption is to make it easy to do so.

Ideally, what you need is an encrypted local drive, and one that is easy to move files in and out of. There are plenty of services available that work just like Dropbox or similar storage services, but automatically encrypt files as they are uploaded. Using these, encryption becomes second nature, and if files are encrypted locally you don't need to worry about sending them to cloud storage or anything else.

And best of all, you need _zero_ knowledge about how encryption works. I would recommend, of course, reading about what you are actually doing when you encrypt files, but for the non-techies out there, making encryption simple is by far the best way of making it ubiquitous.

---

## About the Author
Sam Bocetta is a defense contractor for the U.S. Navy, a defense analyst, and a freelance journalist. He specializes in finding radical – and often heretical – solutions to "impossible" ballistics problems. He now writes for <a href="https://gunnewsdaily.com/" target="_blank">Gun News Daily</a> about naval engineering, mechanical engineering, electrical engineering, marine ops, program management, defense contracting, export control, international commerce, patents, InfoSec, cryptography, cyberwarfare, and cyberdefense.
