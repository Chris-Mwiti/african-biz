import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Event } from '../lib/types';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';

export const useGetEvents = () => {
  return useQuery<Event[], Error>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get<Event[]>('/events');
      return response.data;
    },
  });
};

export const useGetEvent = (id: string) => {
  return useQuery<Event, Error>({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get<Event>(`/events/${id}`);
      return response.data;
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<Event, Error, CreateEventDto>({
    mutationFn: async (newEvent: CreateEventDto) => {
      const response = await api.post<Event>('/events', newEvent);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<Event, Error, UpdateEventDto>({
    mutationFn: async (updatedEvent: UpdateEventDto) => {
      const response = await api.patch<Event>(`/events/${id}`, updatedEvent);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (eventId: string) => {
      await api.delete(`/events/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      // Assuming there might be a useGetUserEvents hook, invalidate that too
      queryClient.invalidateQueries({ queryKey: ['userEvents'] });
    },
  });
};
