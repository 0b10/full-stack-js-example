# Setup

## Postgresql

### Start Daemon
Run the following command to run postgresql daemon:

```sh
sudo systemctl start postgresql
```

### Create Databases

Run the following commands to create the necessary databases:

```sh
sudo -u postgres -s createdb dev_full_stack_js_example
sudo -u postgres -s createdb test_full_stack_js_example
```

### Create Credentials File

<details>
	<summary>Note on the assumed server configuration</summary>
A credentials file assumes that you have password authentication set up in your config file: `/var/lib/pgsql/data/pg_hba.conf`.
	
(Note that md5 is very insecure, and that there are alternatives.)

TYPE | DATABASE | USER | ADDRESS | METHOD
--- | --- | --- | --- | ---
local | all | all | | md5
host | all | all | 127.0.0.1/32 | md5

</details>

Add the following two lines to ~/.pgpass:

> \<**hostname**\>:\<**port**\>:dev\_full\_stack\_js\_example:\<**username**\>:\<**password**\>

> \<**hostname**\>:\<**port**\>:test\_full\_stack\_js\_example:\<**username**\>:\<**password**\>

<details>
    <summary>Example</summary>

    > localhost:5432:dev_full_stack_js_example:user:mypassword
    > localhost:5432:test_full_stack_js_example:user:mypassword
</details>

Then change permissions:

```sh
chmod 0600 ~/.pgpass
```