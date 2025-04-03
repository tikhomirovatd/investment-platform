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
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// Импортируем список тем из SelectRequestTypeModal
import { requestTopics } from "./SelectRequestTypeModal";

// Extend the insert schema with validation
const requestFormSchema = z.object({
  userType: z.enum(["SELLER", "BUYER"]),
  topic: z.string().min(1, { message: "Тема запроса обязательна" }),
  fullName: z.string().min(2, { message: "Полное имя должно содержать не менее 2 символов" }),
  phone: z.string().optional(),
  comments: z.string().optional(),
});

// Define the form values type
type RequestFormValues = z.infer<typeof requestFormSchema>;

interface CreateRequestFormProps {
  topic: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateRequestForm({ topic, onBack, onSuccess }: CreateRequestFormProps) {
  // Initialize the form with react-hook-form
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      userType: "BUYER",
      topic: topic,
      fullName: "",
      phone: "",
      comments: "",
    },
  });

  // API mutation for creating a request
  const createRequestMutation = useMutation({
    mutationFn: (newRequest: InsertRequest) => 
      fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRequest)
      }).then(res => res.json()),
    onSuccess: () => {
      // Invalidate the requests query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['/api/requests'] });
      onSuccess();
      form.reset();
      onBack();
    }
  });

  // Form submission handler
  const onSubmit = (data: RequestFormValues) => {
    createRequestMutation.mutate(data);
  };

  return (
    <div className="mt-8 px-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Вернуться к таблице
      </Button>
      
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold tracking-tight">{topic}</h2>
          <Badge className="bg-[rgb(235,230,250)] text-purple-800 hover:bg-[rgb(235,230,250)]">Новый</Badge>
        </div>
        <p className="text-muted-foreground">{format(new Date(), "d MMMM yyyy в HH:mm", { locale: ru })}</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип пользователя</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          
          {/* Скрыто, так как тема уже выбрана */}
          <input type="hidden" {...form.register("topic")} />
          
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
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Комментарии</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Введите дополнительные комментарии"
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onBack}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={createRequestMutation.isPending}
              className="bg-[#FEE600] hover:bg-[#FED800] text-black"
            >
              {createRequestMutation.isPending ? "Отправка..." : "Создать запрос"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}