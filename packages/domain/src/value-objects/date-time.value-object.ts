import { type Either, failure, success } from '@peatti/utils'

import { type DateTimeOutOfRangeError } from '../errors/value-objects/date-time/date-time-out-of-range.error'
import { InvalidDateTimeError } from '../errors/value-objects/date-time/invalid-date-time.error'
import { InvalidDayOfWeekError } from '../errors/value-objects/date-time/invalid-day-of-week.error'
import { InvalidMonthOfYearError } from '../errors/value-objects/date-time/invalid-month-of-year.error'

export enum DAY_OF_WEEK {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday'
}

export enum MONTH_OF_YEAR {
  JANUARY = 'january',
  FEBRUARY = 'february',
  MARCH = 'march',
  APRIL = 'april',
  MAY = 'may',
  JUNE = 'june',
  JULY = 'july',
  AUGUST = 'august',
  SEPTEMBER = 'september',
  OCTOBER = 'october',
  NOVEMBER = 'november',
  DECEMBER = 'december'
}

export class DateTime {
  public readonly value: Date

  private constructor(parameters: { dateTime: Date }) {
    this.value = parameters.dateTime
    Object.freeze(this)
  }

  public static fromDate(parameters: { date: Date }): Either<InvalidDateTimeError, { dateTimeCreated: DateTime }> {
    if (!this.isValidDate({ date: parameters.date })) {
      return failure(new InvalidDateTimeError({ dateTime: parameters.date }))
    }
    return success({ dateTimeCreated: new DateTime({ dateTime: parameters.date }) })
  }

  public static fromString(parameters: {
    dateString: string
  }): Either<InvalidDateTimeError, { dateTimeCreated: DateTime }> {
    const date = new Date(parameters.dateString)
    if (!this.isValidDate({ date })) {
      return failure(new InvalidDateTimeError({ dateTime: parameters.dateString }))
    }
    return success({ dateTimeCreated: new DateTime({ dateTime: date }) })
  }

  public static fromTimestamp(parameters: {
    timestamp: number
  }): Either<InvalidDateTimeError, { dateTimeCreated: DateTime }> {
    const date = new Date(parameters.timestamp)
    if (!this.isValidDate({ date })) {
      return failure(new InvalidDateTimeError({ dateTime: parameters.timestamp }))
    }
    return success({ dateTimeCreated: new DateTime({ dateTime: date }) })
  }

  public static now(): DateTime {
    const now = new Date()
    const utcMinus3 = new Date(now.getTime() - 3 * 60 * 60 * 1000)
    return new DateTime({ dateTime: utcMinus3 })
  }

  public static nowUTC(): DateTime {
    return new DateTime({ dateTime: new Date() })
  }

  public static nowInTimezone(parameters: {
    timezone: string
  }): Either<InvalidDateTimeError, { dateTimeCreated: DateTime }> {
    try {
      const now = new Date()
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60_000
      // For Brazil (UTC-3), we subtract 3 hours
      const timezoneOffset = DateTime.getTimezoneOffset(parameters.timezone)
      const localTime = new Date(utcTime + timezoneOffset * 60_000)
      return success({ dateTimeCreated: new DateTime({ dateTime: localTime }) })
    } catch {
      return failure(new InvalidDateTimeError({ dateTime: parameters.timezone }))
    }
  }

  public toTimezone(parameters: { timezone: string }): Either<InvalidDateTimeError, { dateTimeConverted: DateTime }> {
    try {
      const utcTime = this.value.getTime() + this.value.getTimezoneOffset() * 60_000
      const timezoneOffset = DateTime.getTimezoneOffset(parameters.timezone)
      const localTime = new Date(utcTime + timezoneOffset * 60_000)
      return success({ dateTimeConverted: new DateTime({ dateTime: localTime }) })
    } catch {
      return failure(new InvalidDateTimeError({ dateTime: parameters.timezone }))
    }
  }

  private static getTimezoneOffset(timezone: string): number {
    const timezoneOffsets: Record<string, number> = {
      UTC: 0,
      'America/Sao_Paulo': -180, // UTC-3
      'America/New_York': -300, // UTC-5 (EST) / UTC-4 (EDT)
      'America/Los_Angeles': -480, // UTC-8 (PST) / UTC-7 (PDT)
      'Europe/London': 0, // UTC+0 (GMT) / UTC+1 (BST)
      'Europe/Paris': 60, // UTC+1 (CET) / UTC+2 (CEST)
      'Asia/Tokyo': 540, // UTC+9
      'Asia/Shanghai': 480, // UTC+8
      'Australia/Sydney': 660 // UTC+11 (AEDT) / UTC+10 (AEST)
    }
    return timezoneOffsets[timezone] ?? 0
  }

  public static create(parameters: { dateTime: Date }): Either<InvalidDateTimeError, { dateTimeCreated: DateTime }> {
    if (!this.isValidDate({ date: parameters.dateTime })) {
      return failure(new InvalidDateTimeError({ dateTime: parameters.dateTime }))
    }
    return success({ dateTimeCreated: new DateTime({ dateTime: parameters.dateTime }) })
  }

  public static validate(parameters: {
    dateTime: Date | string | number
  }): Either<InvalidDateTimeError | DateTimeOutOfRangeError, { dateTimeValidated: DateTime }> {
    let date: Date

    if (parameters.dateTime instanceof Date) {
      date = parameters.dateTime
    } else if (typeof parameters.dateTime === 'string') {
      date = new Date(parameters.dateTime)
    } else {
      date = new Date(parameters.dateTime)
    }

    if (!this.isValidDate({ date })) {
      return failure(new InvalidDateTimeError({ dateTime: parameters.dateTime }))
    }

    return success({ dateTimeValidated: new DateTime({ dateTime: date }) })
  }

  public equals(parameters: { otherDateTime: DateTime }): boolean {
    if (!(parameters.otherDateTime instanceof DateTime)) return false
    return this.value.getTime() === parameters.otherDateTime.value.getTime()
  }

  public isBefore(parameters: { otherDateTime: DateTime }): boolean {
    return this.value < parameters.otherDateTime.value
  }

  public isAfter(parameters: { otherDateTime: DateTime }): boolean {
    return this.value > parameters.otherDateTime.value
  }

  public isBetween(parameters: { startDateTime: DateTime; endDateTime: DateTime }): boolean {
    return this.value >= parameters.startDateTime.value && this.value <= parameters.endDateTime.value
  }

  public diffInMilliseconds(parameters: { otherDateTime: DateTime }): number {
    return this.value.getTime() - parameters.otherDateTime.value.getTime()
  }

  public diffInDays(parameters: { otherDateTime: DateTime }): number {
    const diffInMs = this.diffInMilliseconds(parameters)
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  }

  public addDays(parameters: { days: number }): DateTime {
    const newDate = new Date(this.value)
    newDate.setDate(newDate.getDate() + parameters.days)
    return new DateTime({ dateTime: newDate })
  }

  public addHours(parameters: { hours: number }): DateTime {
    const newDate = new Date(this.value)
    newDate.setHours(newDate.getHours() + parameters.hours)
    return new DateTime({ dateTime: newDate })
  }

  public addMinutes(parameters: { minutes: number }): DateTime {
    const newDate = new Date(this.value)
    newDate.setMinutes(newDate.getMinutes() + parameters.minutes)
    return new DateTime({ dateTime: newDate })
  }

  public toTimestamp(): number {
    return this.value.getTime()
  }

  public getYear(): number {
    return this.value.getFullYear()
  }

  public getMonth(): Either<InvalidMonthOfYearError, { monthOfYear: MONTH_OF_YEAR }> {
    switch (this.value.getMonth()) {
      case 0: {
        return success({ monthOfYear: MONTH_OF_YEAR.JANUARY })
      }
      case 1: {
        return success({ monthOfYear: MONTH_OF_YEAR.FEBRUARY })
      }
      case 2: {
        return success({ monthOfYear: MONTH_OF_YEAR.MARCH })
      }
      case 3: {
        return success({ monthOfYear: MONTH_OF_YEAR.APRIL })
      }
      case 4: {
        return success({ monthOfYear: MONTH_OF_YEAR.MAY })
      }
      case 5: {
        return success({ monthOfYear: MONTH_OF_YEAR.JUNE })
      }
      case 6: {
        return success({ monthOfYear: MONTH_OF_YEAR.JULY })
      }
      case 7: {
        return success({ monthOfYear: MONTH_OF_YEAR.AUGUST })
      }
      case 8: {
        return success({ monthOfYear: MONTH_OF_YEAR.SEPTEMBER })
      }
      case 9: {
        return success({ monthOfYear: MONTH_OF_YEAR.OCTOBER })
      }
      case 10: {
        return success({ monthOfYear: MONTH_OF_YEAR.NOVEMBER })
      }
      case 11: {
        return success({ monthOfYear: MONTH_OF_YEAR.DECEMBER })
      }
      default: {
        return failure(new InvalidMonthOfYearError({ monthOfYear: this.value.getMonth() }))
      }
    }
  }

  public getDay(): number {
    return this.value.getDate()
  }

  public getHour(): number {
    return this.value.getHours()
  }

  public getMinute(): number {
    return this.value.getMinutes()
  }

  public getSecond(): number {
    return this.value.getSeconds()
  }

  public getDayOfWeek(): Either<InvalidDayOfWeekError, { dayOfWeek: DAY_OF_WEEK }> {
    switch (this.value.getDay()) {
      case 0: {
        return success({ dayOfWeek: DAY_OF_WEEK.SUNDAY })
      }
      case 1: {
        return success({ dayOfWeek: DAY_OF_WEEK.MONDAY })
      }
      case 2: {
        return success({ dayOfWeek: DAY_OF_WEEK.TUESDAY })
      }
      case 3: {
        return success({ dayOfWeek: DAY_OF_WEEK.WEDNESDAY })
      }
      case 4: {
        return success({ dayOfWeek: DAY_OF_WEEK.THURSDAY })
      }
      case 5: {
        return success({ dayOfWeek: DAY_OF_WEEK.FRIDAY })
      }
      case 6: {
        return success({ dayOfWeek: DAY_OF_WEEK.SATURDAY })
      }
      default: {
        return failure(new InvalidDayOfWeekError({ dayOfWeek: this.value.getDay() }))
      }
    }
  }

  public isToday(): boolean {
    const today = new Date()
    return this.value.toDateString() === today.toDateString()
  }

  public isYesterday(): boolean {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return this.value.toDateString() === yesterday.toDateString()
  }

  public isTomorrow(): boolean {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return this.value.toDateString() === tomorrow.toDateString()
  }

  private static isValidDate(parameters: { date: Date }): boolean {
    return parameters.date instanceof Date && !Number.isNaN(parameters.date.getTime())
  }
}
