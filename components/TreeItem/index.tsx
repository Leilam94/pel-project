import Link from "next/link";
import TreeItem from "@material-ui/lab/TreeItem";
import {
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkStyle: {
      all: "unset",
    },
  })
);
export default function TreeNode(props:any) {
  const classes = useStyles();
  return (
    <Link href={props.href} passHref>
      <a className={classes.linkStyle}>
        <TreeItem nodeId={props.nodeId} label={props.label} icon={props.icon} />
      </a>
    </Link>
  );
}
