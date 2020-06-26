# Task-manager-api
This is API for a task-manger.
You can create a user and tasks. You can also update user and tasks. You can also delete them

<h3>To install dependencies</h3>

```
yarn install
```
<h3> To run locally</h3>

```
yarn run dev
```

The mail service used here is <b>MAILGUN</b>

You need to create 4 enviorment variable in order to run this RESTAPI
<ul>
<li>SECRET_KEY(for jwt)</li>
<li>EMAIL_KEY(mailgun key)</li>
<li>DOMAIN(your domain name)</li>
<li>MONGODB_URL(your mongo database link)</li>
</ul>
