import { z } from "zod";
import { Field } from "@/types/field";
import { EditComponent } from "./edit-component";

const schema = (field: Field) => {
  let zodSchema = z.object({
    projectData: z.any(),
    html: z.string(),
    css: z.string(),
  });


  return zodSchema;
};

export { schema, EditComponent };