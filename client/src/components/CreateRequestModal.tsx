import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertRequest } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Extend the insert schema with validation
const requestFormSchema = z.object({
  userType: z.enum(["SELLER", "BUYER"]),
  topic: z.string().min(3, { message: "Topic must be at least 3 characters" }),
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED", "REJECTED"]).default("NEW"),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  phone: z.string().optional(),
  comments: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateRequestModal({ isOpen, onClose, onSuccess }: CreateRequestModalProps) {
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      userType: "SELLER",
      topic: "",
      status: "NEW",
      fullName: "",
      phone: "",
      comments: "",
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: (newRequest: InsertRequest) => 
      apiRequest("POST", "/api/requests", newRequest)
        .then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
      onSuccess();
      onClose();
      form.reset();
    },
  });

  const onSubmit = (data: RequestFormValues) => {
    createRequestMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новый запрос</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип пользователя</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип пользователя" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SELLER">Продавец</SelectItem>
                      <SelectItem value="BUYER">Покупатель</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите тему запроса" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полное имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите полное имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите номер телефона" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NEW">Новый</SelectItem>
                      <SelectItem value="IN_PROGRESS">В процессе</SelectItem>
                      <SelectItem value="COMPLETED">Завершен</SelectItem>
                      <SelectItem value="REJECTED">Отклонен</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарии</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Введите комментарии" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                className="bg-[#3498DB] hover:bg-[#2980b9]"
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? "Создание..." : "Создать"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
