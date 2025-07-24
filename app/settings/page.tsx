"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { trpc } from "../_trpc/client";
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

const formSchema = z.object({
  name: z.string().min(1).max(30),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Settings() {
  const utils = trpc.useUtils();
  const getCategories = trpc.category.getCategories.useQuery();
  const createMutation = trpc.category.createCategory.useMutation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: FormSchema) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        utils.category.getCategories.invalidate();
      },
    });
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {getCategories.data?.map((el) => (
        <div key={el.id}>{el.name}</div>
      ))}
    </div>
  );
}
