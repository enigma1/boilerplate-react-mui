import {Helmet} from "react-helmet";

const Meta = ({title, description}) =>
  <Helmet>
    <base href="/" />
    <meta charSet="utf-8" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>

export default Meta;
