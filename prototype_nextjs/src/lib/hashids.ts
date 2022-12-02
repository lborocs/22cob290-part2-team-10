import Hashids from 'hashids';

const PEPPER = 'Team-10-Group-Project-Part-2';

const hashids = new Hashids(PEPPER, 6);
export default hashids;
