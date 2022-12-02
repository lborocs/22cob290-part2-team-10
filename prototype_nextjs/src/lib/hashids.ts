import Hashids from 'hashids';

const PEPPER = process.env.HASHIDS_SALT;

const hashids = new Hashids(PEPPER);
export default hashids;
