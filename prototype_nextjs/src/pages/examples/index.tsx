import Head from 'next/head';
import Link from 'next/link';
import ListGroup from 'react-bootstrap/ListGroup';

export default function ExamplesPage() {
  return (
    <main className="vh-100 d-flex align-items-center justify-content-center flex-column">
      <Head>
        <title>Examples</title>
      </Head>

      <h1>Examples</h1>
      <small>{'Note: You need to be logged in (it\'ll redirect you)'}</small>

      <ListGroup as="ul">
        <ListGroup.Item as="li">
          <section>
            <h2>Template</h2>
            <ul>
              <li><Link href="/examples/page_template">Page template (you copy and paste the code)</Link></li>
            </ul>
          </section>
        </ListGroup.Item>

        <ListGroup.Item as="li">
          <section>
            <h2>Page</h2>
            <ul>
              <li><Link href="/examples/user_ssr">
                Getting user from <code>user</code> prop from SSR <small><strong>(not recommended)</strong></small>
              </Link></li>
            </ul>
            <ul>
              <li><Link href="/examples/user_userstore">
                Getting user from <code>userStore</code> <small><strong>(recommended)</strong></small>
              </Link></li>
            </ul>
          </section>
        </ListGroup.Item>

        <ListGroup.Item as="li">
          <section>
            <h2>Sidebar</h2>
            <ListGroup as="ol" numbered>
              <ListGroup.Item as="li">
                <Link href="/examples/projects_sidebar">Projects sidebar</Link>
              </ListGroup.Item>
              <ListGroup.Item as="li">
                <Link href="/examples/custom_sidebar">Custom sidebar</Link>
              </ListGroup.Item>
              <ListGroup.Item as="li">
                <Link href="/examples/no_sidebar">No sidebar (with title)</Link>
              </ListGroup.Item>
            </ListGroup>
          </section>
        </ListGroup.Item>
      </ListGroup>

    </main>
  );
}

ExamplesPage.noAuth = true;
