import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { UserRole } from "@/user/v1/user_pb";
import { Label } from "./ui/label";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
};

export function UserRoleRadio<T extends FieldValues>(props: Props<T>) {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {!!label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              {Object.values(UserRole)
                .filter((u) => typeof u !== "number" && u !== "UNSPECIFIED")
                .map((key) => {
                  if (typeof key !== "string") {
                    return null;
                  }

                  return (
                    <div key={key} className="flex items-center space-x-2">
                      <RadioGroupItem value={key} id={key}>
                        {key}
                      </RadioGroupItem>
                      <Label htmlFor={key}>{key}</Label>
                    </div>
                  );
                })}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
