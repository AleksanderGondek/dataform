---
title: Google BigQuery
---

# Authentification

Dataform will connect to BigQuery using a service account. You’ll need to create a service account from your Google Cloud Console and assign it permissions to access BigQuery.

1. Follow <a target="_blank" rel="noopener" href="https://cloud.google.com/iam/docs/creating-managing-service-accounts#creating_a_service_account">these instructions</a> to create a new service account in Google Cloud Console.
2. Grant the new account the `BigQuery Admin` role. (Admin access is required by Dataform so that it can create queries and list tables.) Read
   <a target="_blank" rel="noopener" href="https://cloud.google.com/iam/docs/granting-roles-to-service-accounts#granting_access_to_a_service_account_for_a_resource">this</a> if you need help.
3. Create a key for your new service account (in JSON format). You will upload this file to Dataform. Read
   <a target="_blank" rel="noopener" href="https://cloud.google.com/iam/docs/creating-managing-service-account-keys#creating_service_account_keys">this</a> if you need help.

BigQuery specific options can be applied to tables using the `bigquery` configuration parameter.

# Configuration options

## Setting table partitions

BigQuery supports <a target="_blank" rel="noopener" href="https://cloud.google.com/bigquery/docs/partitioned-tables">partitioned tables</a>.
These can be useful when you have data spread across many different dates but usually query the table on only a small range of dates.
In these circumstances, partitioning will increase query performance and reduce cost.

BigQuery partitions can be configured in Dataform using the `partitionBy` option:

```js
config {
  type: "table",
  bigquery: {
    partitionBy: "DATE(ts)"
  }
}
SELECT CURRENT_TIMESTAMP() AS ts
```

This query compiles to the following statement which takes advantage of BigQuery's DDL to configure partitioning:

```js
CREATE OR REPLACE TABLE dataform.example
PARTITION BY DATE(ts)
AS (SELECT CURRENT_TIMESTAMP() AS ts)
```

If desired, partitions can be clustered by using the `clusterBy` option, for example:

```js
config {
  type: "table",
  bigquery: {
    partitionBy: "DATE(ts)",
    clusterBy: ["name", "revenue"]
  }
}
SELECT CURRENT_TIMESTAMP() as ts, name, revenue
```

## Configuring access to Google Sheets

In order to be able to query Google Sheets tables via BigQuery, you'll need to share the sheet with the service account that is used by Dataform.

- Find the email address of the service account you connected Dataform with by looking in the `.df-credentials.json` file locally, or by finding the account from the [Google Cloud IAM service accounts console](https://console.cloud.google.com/iam-admin/serviceaccounts).
- Share the Google sheet with the email address of the service account as you would a colleague, through the sheets sharing settings and make sure it has access.

## Using different project_ids within the same project

You can both read from and publish to two separate GCP project_ids within a single Dataform project. For example, you may have a project_id called `raw` that contains raw data loaded in your warehouse and a project_id called `analytics` in which you create data tables you use for analytics and reporting.

Your default project id is defined in the `defaultDatabase` field in your `dataform.json` file.

```js
{
  "warehouse": "bigquery",
  "defaultSchema": "dataform",
  "assertionSchema": "dataform_assertions",
  "defaultDatabase": "analytics"
}
```

You can then override the default gcp project id in the `database` field in the config block of your SQLX files

```js
config {
  type: "table",
  database: “raw”
}
```

### Using separate project-ids for development and production

You can configure separate project-ids for development and production in your `environment.json` file. The process is described on [this page](https://docs.dataform.co/dataform-web/guides/environments#example-use-separate-databases-for-development-and-production-data).

# Dataform web features

## Real time query validation

Dataform validates the compiled script you are editing against BigQuery in real time. It will let you know if the query is valid (or won’t run) before having to run it.

## Bytes processed

Dataform displays Bytes processed and Bytes billed for every run you do in Dataform in the run logs page. You can then estimate the cost of those queries by multiplying the bytes billed by your company price per Byte.

# Packages

## BigQuery Audit Logs

We published a package that helps the analysis of BigQuery usage logs. You can find more information by reading the related blog post or the package page.

# Blog posts

We published the following blog post specifically for BigQuery users.

## Sending data from BigQuery to Intercom using Google Cloud Functions

The blog post offers a walkthrough to use Google Cloud Functions to push data from tables and views in BigQuery to third party services like Intercom.

<a href="https://dataform.co/blog/exporting-bigquery-usage-logs"><button>Read the article on the blog</button></a>

## Building an end to end Machine Learning Pipeline in Bigquery

The blog post offers a walkthrough to build a simple end to end Machine Learning pipeline using BigQueryML in Dataform.

<a href="https://dataform.co/blog/bq-ml-pipeline"><button>Read the article on the blog</button></a>

# Getting help

If you are using Dataform web and are having trouble connecting to BigQuery, please reach out to us by using the intercom messenger at the bottom right.

If you have other questions related to BigQuery, you can join our slack community and ask question on the #bigquery channel.

<a href="https://slack.dataform.co"><button>Join dataform-users on slack</button></a>
