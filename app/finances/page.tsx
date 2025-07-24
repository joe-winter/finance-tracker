"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionType } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import z from "zod";
import { cn } from "@/lib/utils";
import { trpc } from "../_trpc/client";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { TransactionTable } from "../components/finances/transactions-table";

const formSchema = z.object({
  type: z.enum(Object.values(TransactionType)),
  amount: z.number().min(0),
  date: z.date(),
  categoryId: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;
export default function Finances() {
  const utils = trpc.useUtils();
  const getTransactions = trpc.transaction.getTransactions.useQuery();
  const getCategories = trpc.category.getCategories.useQuery();
  const createMutation = trpc.transaction.createTransaction.useMutation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      type: TransactionType["EXPENSE"],
    },
  });

  const handleSubmit = (data: FormSchema) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        utils.transaction.getTransactions.invalidate();
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <CurrencyInput
                    name={field.name}
                    className={cn(
                      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                    )}
                    value={field.value === 0 ? undefined : field.value}
                    onValueChange={(value) => {
                      field.onChange(value ? parseFloat(value) : 0);
                    }}
                    onBlur={field.onBlur}
                    placeholder="Enter amount"
                    prefix="£"
                    step={0.01}
                    decimalsLimit={2}
                    allowDecimals={true}
                    allowNegativeValue={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
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
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
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
                    {getCategories.data?.map((category) => (
                      <SelectItem
                        value={category.id}
                        key={category.id}
                        className="capitalize"
                      >
                        {category.name}
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
      {<TransactionTable data={getTransactions.data ?? []} />}
    </div>
  );
}
