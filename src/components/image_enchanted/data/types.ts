export interface EnchantedImage {
  id?: number;
  name?: string;
  data?: string;

  is_gray?: boolean;
  gray_scale?: number;

  is_noise?: boolean;
  noise_level?: number;
  noise_type?: string;
}
