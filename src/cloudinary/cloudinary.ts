import { v2 } from 'cloudinary';
import configuration from 'src/configs/configuration';
import { CLOUDINARY } from 'src/utils/constants/common.constant';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: configuration().cloudinary.cloudinaryName,
      api_key: configuration().cloudinary.cloudinaryApiKey,
      api_secret: configuration().cloudinary.cloudinaryApiSecret,
    });
  },
};
