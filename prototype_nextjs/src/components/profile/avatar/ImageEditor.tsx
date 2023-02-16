/* eslint-disable @next/next/no-img-element */
import { z } from 'zod';

import useUserStore from '~/store/userStore';

const formSchema = z.object({
  image: z.string().url().or(z.string().max(0)),
});

// TODO: allow image to be empty string, then update save button to instead show "Remove Image"
// think already done that in zod schema above, but need to test
// and look at zod docs for "or"

export default function ImageEditor() {
  // TODO: form

  const { id, image, name } = useUserStore((state) => state.user);

  // TODO: api route

  return (
    <div>
      <h4>Image Editor</h4>
      {image ? <img src={image} alt={name} /> : <p>No image</p>}

      {/* TODO: use formik & mui */}
      <form>
        <label htmlFor="image">Image URL</label>
        <input type="text" id="image" name="image" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
