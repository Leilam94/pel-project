import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    marginTop: 150,
    padding: 20,
    textAlign: "center",
  },
  line: {
    display: "flex",
    maxWidth: "80%",
    width: 300,
    backgroundColor: "gray",
    marginBottom: 20,
    marginTop: 10,
  },
  color: {
    color: `${theme.palette.text.secondary}`,
  },
}));

export default function NotFoundPage() {
  const classes = useStyles();
  const router = useRouter();
  const returnHandler = () => {
    router.replace("/Dashboard");
  };
  return (
    <Grid container direction="column" className={classes.root}>
      <h1>
        Oops!! <span className={classes.color}>404</span> Error
      </h1>
      <h3>The page you&apos;re looking for does&apos;nt exist.</h3>
      <p> just click the below button to return dashboard</p>
      <div className={classes.line}>
        <Divider orientation="horizontal" />
      </div>
      <Button color="primary" onClick={returnHandler} variant="contained">
        Dashboard
      </Button>
    </Grid>
  );
}
