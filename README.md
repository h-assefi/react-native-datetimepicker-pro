# React Native DateTimePicker Pro 📆

A customizable calendar, time & month picker for React Native (including Persian Jalaali calendar & locale). For more information and documentation, please visit [website] (https://h-assefi.github.io/react-native-datetimepicker-pro)

## Installation

**npm package users**

> npm i react-native-datetimepicker-pro

**yarn package users**

> yarn add react-native-datetimepicker-pro



 **Screen shots**
  
![Screenshot_1652875688](https://user-images.githubusercontent.com/43260748/169036251-cc252cc0-b8c3-4b87-be33-06425f9ca939.png)


![Screenshot_1652875715](https://user-images.githubusercontent.com/43260748/169036280-762b40b5-aa94-4382-a0cb-431aaf6dc5db.png)


![Screenshot_1652875701](https://user-images.githubusercontent.com/43260748/169036295-c9c0a9de-b344-4179-a4d1-279d4901d7ef.png)

  
## Examples

**Basic example**
```
import React, { useState } from 'react';
import DatePicker from 'react-native-datetimepicker-pro';

const BasicUsage = () => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <DatePicker
      onSelectedChange={date => setSelectedDate(date)}
    />
  );
};
```

**Jalali Calendar**

```
import React from 'react';
import DatePicker, { getFormatedDate } from 'react-native-datetimepicker-pro';

const JalaliExample = () => {
  return (
    <DatePicker
      isGregorian={false}
      options={{
        defaultFont: 'Shabnam-Light',
        headerFont: 'Shabnam-Medium',
      }}
      selected={getFormatedDate(new Date(), 'jYYYY/jMM/jDD')}
    />
  );
};
```

## API

### Props

| Prop             | Type   | Optional      | Default | Description                                                                      |
| ---------------- | ------ | ------------- | ------- | -------------------------------------------------------------------------------- |
| isGregorian      | bool   | Yes           | true    | Gregorian calendar is the default. if shamsi is required set this prop to false. |
| selected         | string | Yes           | null    | for gregorian the format should be 'YYYY-MM-DD' and for shamsi 'jYYYY/jMM/jDD'   |
| onSelectedChange | func   | No (required) |         | Selected date is returned as a parameter to the function.                        |
options |props  | Yes       |       | Some visual effects like font and colors are asigned threw this prop. Check the options prop description table for more info.

### Options Props
| Prop             | Type   | Optional      | Default | Description                                                                      |
| ---------------- | ------ | ------------- | ------- | -------------------------------------------------------------------------------- |
defaultFont | string    | Yes       | 'System'  | font of dates and times.
headerFont  | string    | Yes       |  'System' | font of the headers

