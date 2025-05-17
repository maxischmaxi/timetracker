"use client";

import Cookie from "js-cookie";
import { useMutation, useQuery } from "@tanstack/react-query";
import { use } from "react";
import { AuthContext } from "@/components/auth-provider";
import { format, differenceInMinutes } from "date-fns";
import { createJob } from "@/lib/api";
import { JobType } from "@/project/v1/project_pb";
import { de } from "date-fns/locale";

export type GoogleCalendarEvent = {
  kind: string;
  id: string;
  status: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    timeZone?: string;
  };
  recurrence?: string[];
  attendees?: Array<{
    email: string;
    responseStatus: string;
  }>;
};

export interface GoogleCalendarEventsResponse {
  kind: string;
  etag: string;
  summary: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  items: GoogleCalendarEvent[];
}

export function useGoogleCalendarEvents(date: Date) {
  const { firebaseUser } = use(AuthContext);
  return useQuery({
    enabled: !!firebaseUser,
    queryKey: ["getGoogleCalendarEvents", firebaseUser?.uid || "", date],
    async queryFn(): Promise<GoogleCalendarEvent[]> {
      const accessToken = Cookie.get("__access_token");
      if (!accessToken) {
        throw new Error("access token missing");
      }

      const _date = format(date, "yyyy-MM-dd");
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${_date}T00:00:00Z&timeMax=${_date}T23:59:59Z&singleEvents=true&orderBy=startTime`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      return (await response.json()).items;
    },
  });
}

export function useImportGoogleCalendarEvent() {
  return useMutation({
    async mutationFn({
      data,
      projectId,
      serviceTypeId,
    }: {
      data: GoogleCalendarEvent;
      projectId: string;
      serviceTypeId: string;
    }) {
      const totalMinutes = differenceInMinutes(
        data.start?.dateTime || new Date(),
        data.end?.dateTime || new Date(),
      );
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      await createJob({
        hours,
        serviceTypeId,
        type: JobType.BILLABLE,
        date: format(data.start?.dateTime || new Date(), "yyyy-MM-dd", {
          locale: de,
        }),
        description: data.summary,
        minutes,
        projectId,
      });
    },
  });
}
