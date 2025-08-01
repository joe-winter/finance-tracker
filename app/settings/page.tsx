"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { trpc } from "../_trpc/client";
import { CategoriesBadge } from "../components/settings/categories-badge";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { TransactionType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const formSchema = z.object({
  name: z.string().min(1).max(30),
  type: z.enum(Object.values(TransactionType)),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Settings() {
  const utils = trpc.useUtils();
  const getCategoriesByType = trpc.category.getCategoriesByType.useQuery();
  const createMutation = trpc.category.createCategory.useMutation();
  const deleteMutation = trpc.category.deleteCategory.useMutation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: TransactionType.EXPENSE,
    },
  });

  const handleSubmit = (data: FormSchema) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        utils.category.getCategoriesByType.invalidate();
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          utils.category.getCategoriesByType.invalidate();
        },
      }
    );
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="grid grid-cols-3 gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={30} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full capitalize">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TransactionType).map((type) => (
                      <SelectItem
                        value={type}
                        key={type}
                        className="capitalize"
                      >
                        {type.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="flex flex-col gap-4">
        <p>Income</p>
        <div className="flex gap-4">
          {getCategoriesByType.data?.INCOME?.map((category) => (
            <CategoriesBadge
              key={category.id}
              category={category}
              handleDelete={handleDelete}
            />
          ))}
        </div>
        <p>Expense</p>
        <div className="flex gap-4">
          {getCategoriesByType.data?.EXPENSE?.map((category) => (
            <CategoriesBadge
              key={category.id}
              category={category}
              handleDelete={handleDelete}
            />
          ))}
        </div>
        <p>Saving</p>
        <div className="flex gap-4">
          {getCategoriesByType.data?.SAVING?.map((category) => (
            <CategoriesBadge
              key={category.id}
              category={category}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
