import Link from 'next/link';
import Button from 'react-bootstrap/Button';

import styles from '~/styles/ErrorPage.module.css';

export type ErrorPageProps = {
  title: string
  buttonContent?: React.ReactNode
  buttonUrl: string
};

/**
 * Custom error page that can be embedded in our layout (the `Error` component from Next
 *  isn't great because it won't fit in our layout because it tries to occupy the entire viewport).
 *
 * @param title
 * @param buttonContent
 * @param buttonUrl
 * @see https://nextjs.org/docs/advanced-features/custom-error-page
 */
export default function ErrorPage({
  title,
  buttonContent = 'Back',
  buttonUrl,
}: ErrorPageProps) {
  return (
    <main className="flex-grow-1 d-flex align-items-center justify-content-center flex-column">
      <div>
        <h2 className={styles.title}>{title}</h2>

        <div className="mt-2 d-flex justify-content-center">
          <Link href={buttonUrl}>
            <Button variant="secondary">
              {buttonContent}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
