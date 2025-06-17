import { useState } from "react";

export const useForm = (initialForm) => {
  const[formData, setFormData] = useState(initialForm);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return {
    formData,
    onInputChange
  };
}
