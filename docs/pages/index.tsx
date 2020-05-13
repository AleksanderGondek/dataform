import { Button } from "@blueprintjs/core";
import { Card, CardActions, CardGrid } from "df/components/card";
import { getContentTree, IExtraAttributes } from "df/docs/content_tree";
import Documentation from "df/docs/layouts/documentation";
import { ITree } from "df/tools/markdown-cms/tree";
import { NextPageContext } from "next";
import * as React from "react";

interface IQuery {
  version: string;
}

export interface IProps {
  index: ITree<IExtraAttributes>;
  version: string;
}

export class Docs extends React.Component<IProps> {
  public static async getInitialProps(ctx: NextPageContext & { query: IQuery }): Promise<IProps> {
    // Strip trailing slashes and redirect permanently, preserving search params.
    // If our URLs have trailing slashes, then our relative paths break.
    const url = new URL(ctx.asPath, "https://docs.dataform.co");
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      ctx.res.writeHead(301, {
        Location: url.pathname.substring(0, url.pathname.length - 1) + url.search
      });
      ctx.res.end();
    }

    const { query } = ctx;
    const tree = await getContentTree(query.version);

    return { index: tree.index(), version: query.version };
  }

  public render() {
    return (
      <Documentation
        version={this.props.version}
        index={this.props.index}
        current={{
          name: "Documentation",
          path: "",
          content: "",
          attributes: {
            title: "Documentation",
            subtitle:
              "Whether you’re a startup or a global enterprise, learn how to use Dataform to manage data in Snowflake, BigQuery and Redshift."
          }
        }}
      >
        <h2>What is Dataform</h2>
        <p>If you are new to Dataform, start here.</p>
        <CardActions>
          <Button intent="primary">Read the introduction</Button>
          <Button>Watch the 2 minute video</Button>
        </CardActions>

        <h2>Join our community</h2>
        <p>
          Join hundreds of data professionals on our slack channel to ask for advice and
          troubleshoot problems.
        </p>
        <CardActions>
          <Button intent="primary">Join dataform-users on slack</Button>
        </CardActions>
      </Documentation>
    );
  }
}

export default Docs;
