---
title: How Dataform works
subtitle: Learn how Dataform compiles your project and runs it in your warehouse
priority: 3
---

## Overview of a Dataform project

Each Dataform project is a repository with a collection of JSON configuration files, SQLX files, and sometimes JS files. Dataform projects contain three types of files:

- Config files
- 📁Definitions
- 📁Includes

**Config files** let you configure your Dataform project. It includes general configuration like the type of warehouse you are using or what schema Dataform should use when creating new tables and views. It also includes configuration for schedules and more advanced use-cases like packages and environments.

**Definitions** is where you add the SQLX files that will define new tables, views, assertions (data quality tests) and other SQL operations that will run in your warehouse.

**Includes** is where you can add JS files where you define variables and functions that you can use across your entire project. You can learn more about includes on [this page]().

<img src="https://assets.dataform.co/docs/introduction/sample_folder.png" width="993"  alt="Dataform project files" />
<caption>A Dataform project in GitHub</caption>

## How Dataform works

<img src="https://assets.dataform.co/docs/introduction/how%20it%20works.png" max-width="1265"  alt="" />

### Step 1. Develop in SQLX

In Dataform, you develop in SQLX. SQLX being an extension of SQL, any SQL file is a valid SQLX file. A typical SQLX file will contain a SELECT statement defining a new table or a view and a config block at the top.

```sql
config { type: "table" }

select
  order_date as date,
  order_id as order_id,
  order_status as order_status,
  sum(item_count) as item_count,
  sum(amount) as revenue

from ${ref("store_clean")}

group by 1, 2
```

<caption>Sample SQLX file</caption>

<div className="bp3-callout bp3-icon-info-sign bp3-intent-primary" markdown="1">
You only need to write `SELECT` statements in SQLX. Dataform takes care of adding boilerplate statements like `CREATE OR REPLACE` or `INSERT` in the following step.

<a href="https://docs.dataform.co/introduction/dataform-5-minutes"><button intent="primary">5 min overview of Dataform and SQLX</button></a></div>

</div>

### Step 2. Dataform compiles your project in real time

Dataform compiles your entire project in real-time, regardless of the number of tables you define. During this step, all SQLX is converted into pure SQL, in the dialect of your data warehouse. The following actions are happening during compilation:

- Boilerplate such as `CREATE TABLE` or `INSERT` statements are added to the code following configuration in the config block
- `Includes` are transpiled into SQL
- The `ref(` function is resolved onto the name of the table that will be created
- Dataform resolves dependencies and checks for errors including missing or circular dependencies
- Dataform builds the dependency tree of all actions to be run in the warehouse

<img src="https://assets.dataform.co/docs/introduction/simple_dag.png" max-width="885" alt="dependency tree" />

<caption>Example of a dependency tree</caption>

```sql
create or replace table "dataform"."orders" as

select
  order_date as date,
  order_id as order_id,
  order_status as order_status,
  sum(item_count) as item_count,
  sum(amount) as revenue

from "dataform_stg"."store_clean"

group by 1, 2
```

<caption>Example of a compiled SQLX file</caption>

<video  controls loop  muted  width="680" ><source src="https://assets.dataform.co/docs/compilation.mp4" type="video/mp4" ><span>Real time compilation on Dataform web</span></video>

<caption>Autosave and real-time compilation on Dataform web</caption>

<video  controls loop  muted  width="680" ><source src="https://assets.dataform.co/docs/compilation_cli.mp4" type="video/mp4" ><span>Real time compilation on Dataform web</span></video>

<caption>Compiling 111 actions in less than 1s with the Dataform CLI</caption>

### Step 3. Dataform connects to your data warehouse to run the dependency tree (or a subset)

Dataform connects to your data warehouse to run SQL commands in your data warehouse, following the order of the dependency tree.

- Tables and views are created in your data warehouse
- Assertions queries are run against your tables and views to check that the data is correct
- Other SQL operations are run

#### Consult logs

After the run, you can consult logs to see what tables were created, if assertions passed or failed, how long each action took to complete, and other information. You can also consult the exact SQL code that was run in your warehouse.

<img src="https://assets.dataform.co/docs/introduction/run_logs.png" width="995"  alt="" />
<caption>Run logs on Dataform web</caption>

### Step 4. Tables are created or updated in your data warehouse

You can use your tables for all your analytics purposes.
