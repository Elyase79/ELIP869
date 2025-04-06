Place your SSL certificates here:

fullchain.pem - Certificate chain file
privkey.pem - Private key file

You can generate these using Let's Encrypt:
$ sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
