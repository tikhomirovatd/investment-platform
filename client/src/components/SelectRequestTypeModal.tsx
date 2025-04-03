import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Список тем для запросов
const REQUEST_TOPICS = ["Заявка на размещение", "Запрос доступа", "Вопросы по проекту"] as const;
export { REQUEST_TOPICS as requestTopics };

type RequestTopic = typeof REQUEST_TOPICS[number];

interface SelectRequestTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (topic: RequestTopic) => void;
}

export function SelectRequestTypeModal({ isOpen, onClose, onSelect }: SelectRequestTypeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Выберите тип запроса</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {REQUEST_TOPICS.map((topic) => (
            <Card 
              key={topic} 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSelect(topic)}
            >
              <CardContent className="p-4">
                <div className="font-medium">{topic === "Заявка на размещение" ? "Создание проекта" : topic}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}