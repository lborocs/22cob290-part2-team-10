import Hashids from 'hashids';

const PEPPER = 'Team-10-Group-Project-Part-2';

/**
 * `Hashids` with the same salt for each instance, so that the masked IDs are unique, but
 * consistent.
 */
const hashids = new Hashids(PEPPER, 6);
export default hashids;
