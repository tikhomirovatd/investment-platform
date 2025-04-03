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
type RequestTopic = typeof requestTopics[number];

// Extend the insert schema with validation
const requestFormSchema = z.object({
  userType: z.enum(["SELLER", "BUYER"]),
  topic: z.string().min(1, { message: "Тема запроса обязательна" }),
  fullName: z.string().min(2, { message: "ФИО должно содержать не менее 2 символов" }),
  organizationName: z.string().optional(),
  cnum: z.string().optional(),
  login: z.string().optional(),
  phone: z.string().optional(),
  comments: z.string().optional(),
});

// Define the form values type
type RequestFormValues = z.infer<typeof requestFormSchema>;

interface CreateRequestFormProps {
  topic: RequestTopic;
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateRequestForm({ topic, onBack, onSuccess }: CreateRequestFormProps) {
  // Initialize the form with react-hook-form
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      userType: topic === "Запрос доступа" ? "BUYER" : "BUYER", // Для "Запрос доступа" всегда "BUYER"
      topic: topic,
      fullName: "",
      organizationName: "",
      cnum: "",
      login: "",
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
          <h2 className="text-2xl font-bold tracking-tight">{topic === "Заявка на размещение" ? "Создание проекта" : topic}</h2>
          <Badge className="bg-[rgb(235,230,250)] text-purple-800 hover:bg-[rgb(235,230,250)]">Новый</Badge>
        </div>
        <p className="text-muted-foreground">{format(new Date(), "d MMMM yyyy в HH:mm", { locale: ru })}</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl">
          {/* Скрыто, так как тема уже выбрана */}
          <input type="hidden" {...form.register("topic")} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Запрос доступа в две колонки */}
            {topic === "Запрос доступа" ? (
              <>
                {/* Левый столбец */}
                <div className="space-y-6">
                  {/* Пользователь */}
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пользователь</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue="BUYER" disabled>
                          <FormControl>
                            <SelectTrigger className="bg-gray-50">
                              <SelectValue placeholder="Выберите тип пользователя" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BUYER">Покупатель</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* ФИО */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ФИО</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите ФИО" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Название организации */}
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название организации</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите название организации" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Телефон */}
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
                </div>
                
                {/* Правый столбец */}
                <div className="space-y-6">
                  {/* CNUM */}
                  <FormField
                    control={form.control}
                    name="cnum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNUM</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите CNUM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Логин */}
                  <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Логин</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите логин" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Комментарий */}
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Комментарий (От пользователя)</FormLabel>
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
                </div>
              </>
            ) : topic === "Заявка на размещение" ? (
              <>
                {/* Левый столбец */}
                <div className="space-y-6">
                  {/* Пользователь */}
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пользователь</FormLabel>
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
                  
                  {/* ФИО */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ФИО</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите ФИО" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Название организации */}
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название организации</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите название организации" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Телефон */}
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
                </div>
                
                {/* Правый столбец */}
                <div className="space-y-6">
                  {/* Комментарий */}
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Комментарий (От пользователя)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Введите дополнительные комментарии"
                            {...field}
                            rows={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Вопросы по проекту - одна колонка */}
                <div className="space-y-6 col-span-2">
                  {/* Пользователь */}
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пользователь</FormLabel>
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
                  
                  {/* ФИО */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ФИО</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите ФИО" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Телефон */}
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
                  
                  {/* Название организации */}
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название организации</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите название организации" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Комментарий */}
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Комментарий (От пользователя)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Введите дополнительные комментарии"
                            {...field}
                            rows={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
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
              {createRequestMutation.isPending ? "Отправка..." : topic === "Заявка на размещение" ? "Создать проект" : "Создать запрос"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}