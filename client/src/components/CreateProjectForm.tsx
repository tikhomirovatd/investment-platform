import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InsertProject } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// Схема для формы создания проекта с валидацией
const projectFormSchema = z.object({
  name: z.string().min(2, { message: "Название актива должно содержать не менее 2 символов" }),
  industry: z.string().min(2, { message: "Индустрия должна содержать не менее 2 символов" }),
  dealType: z.enum(["SALE", "INVESTMENT"], { 
    required_error: "Пожалуйста, выберите тип сделки" 
  }),
  // Контактные данные
  contactName1: z.string().min(2, { message: "ФИО должно содержать не менее 2 символов" }),
  contactPhone1: z.string().optional(),
  contactPosition1: z.string().optional(),
  contactPhone2: z.string().optional(),
  // Параметры бизнеса
  inn: z.string().optional(),
  location: z.string().optional(),
  revenue: z.string().optional(),
  ebitda: z.string().optional(),
  price: z.string().optional(),
  salePercent: z.string().optional(),
  website: z.string().optional(),
  hideUntilNda: z.boolean().default(false),
  comments: z.string().optional(),
  isVisible: z.boolean().default(true),
  isCompleted: z.boolean().default(false),
});

// Тип данных формы
type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface CreateProjectFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateProjectForm({ onBack, onSuccess }: CreateProjectFormProps) {
  // Инициализация формы с react-hook-form
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      industry: "",
      dealType: "SALE",
      contactName1: "",
      contactPhone1: "",
      contactPosition1: "",
      contactPhone2: "",
      inn: "",
      location: "",
      revenue: "",
      ebitda: "",
      price: "",
      salePercent: "",
      website: "",
      hideUntilNda: false,
      comments: "",
      isVisible: true,
      isCompleted: false,
    },
  });

  // Мутация API для создания проекта
  const createProjectMutation = useMutation({
    mutationFn: (newProject: InsertProject) => 
      fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
      }).then(res => res.json()),
    onSuccess: () => {
      // Инвалидация запроса проектов для обновления данных
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      onSuccess();
      form.reset();
      onBack();
    }
  });

  // Обработчик отправки формы
  const onSubmit = (data: ProjectFormValues) => {
    createProjectMutation.mutate(data);
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
          <h2 className="text-2xl font-bold tracking-tight">Создание проекта</h2>
          <Badge className="bg-[rgb(235,230,250)] text-purple-800 hover:bg-[rgb(235,230,250)]">Новый</Badge>
        </div>
        <p className="text-muted-foreground">{format(new Date(), "d MMMM yyyy в HH:mm", { locale: ru })}</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl">
          {/* 1. Способ связи */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-6">Способ связи</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Первый блок полей */}
              <div className="space-y-6">
                {/* ФИО */}
                <FormField
                  control={form.control}
                  name="contactName1"
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
                
                {/* Номер телефона */}
                <FormField
                  control={form.control}
                  name="contactPhone1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Номер телефона</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите номер телефона" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Второй блок полей */}
              <div className="space-y-6">
                {/* Должность */}
                <FormField
                  control={form.control}
                  name="contactPosition1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Должность</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите должность" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Номер телефона (второй) */}
                <FormField
                  control={form.control}
                  name="contactPhone2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Номер телефона</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите номер телефона" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* 2. Параметры */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-6">Параметры</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Левый блок полей */}
              <div className="space-y-6">
                {/* Название актива */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название актива</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите название актива" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Индустрия */}
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Индустрия</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите индустрию" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Тип сделки */}
                <FormField
                  control={form.control}
                  name="dealType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип сделки</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип сделки" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SALE">Продажа</SelectItem>
                          <SelectItem value="INVESTMENT">Инвестиции</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Выручка */}
                <FormField
                  control={form.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Выручка</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите выручку" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* EBITDA с переключателем Скрыть до NDA */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="ebitda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EBITDA</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите EBITDA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Скрыть до NDA */}
                  <FormField
                    control={form.control}
                    name="hideUntilNda"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 mt-1">
                        <div className="space-y-0">
                          <FormLabel className="text-sm">Скрыть до NDA</FormLabel>
                          {field.value && (
                            <FormDescription className="text-xs">
                              Информация будет скрыта до подписания NDA
                            </FormDescription>
                          )}
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="bg-gray-200 data-[state=checked]:bg-[#FEE600]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Стоимость объекта */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Стоимость объекта</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите стоимость объекта" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Сайт компании */}
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сайт компании</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите URL сайта" {...field} />
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
                      <FormLabel>Комментарий</FormLabel>
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
              
              {/* Правый блок полей */}
              <div className="space-y-6">
                {/* ИНН */}
                <FormField
                  control={form.control}
                  name="inn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ИНН</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите ИНН" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Локация */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Локация</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите локацию" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Процент продажи */}
                <FormField
                  control={form.control}
                  name="salePercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Процент продажи</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите процент продажи" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Кнопки действий, зафиксированные внизу */}
          <div className="fixed bottom-0 left-[240px] right-0 bg-white border-t p-4 flex justify-start space-x-4 z-10">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onBack}
            >
              Отмена
            </Button>
            <Button 
              variant="outline" 
              type="button"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Отказать
            </Button>
            <Button 
              variant="outline" 
              type="button"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Отправить на NDA
            </Button>
            <Button 
              type="submit" 
              disabled={createProjectMutation.isPending}
              className="bg-[#FEE600] hover:bg-[#FED800] text-black"
            >
              {createProjectMutation.isPending ? "Создание..." : "Создать проект"}
            </Button>
          </div>
          
          {/* Отступ внизу, чтобы компенсировать фиксированную панель кнопок */}
          <div className="h-20"></div>
        </form>
      </Form>
    </div>
  );
}