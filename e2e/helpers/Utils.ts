/**
 * The timeDifference function calculates the elapsed time in seconds between two given timestamps and
 * logs a message with the provided string and the elapsed time.
 * @param {string} string - A string that represents a message or description of the time difference.
 * @param {number} start - The `start` parameter represents the starting time in milliseconds.
 * @param {number} end - The "end" parameter represents the end time in milliseconds.
 */
export function timeDifference(string: string, start: number, end: number) {
  const elapsed = (end - start) / 1000;
  console.log(`${string} It took ${elapsed} seconds.`);
}

/**
 * The `selectElement` function is used to select an element on a mobile app based on its ID or text,
 * with an optional wildcard search.
 * @param {'id' | 'text'} type - The `type` parameter specifies the type of element to select. It can
 * have two possible values: 'id' or 'text'.
 * @param {string} text - The `text` parameter is a string that represents the identifier or the text
 * content of the element you want to select.
 * @param {boolean} [wild] - The `wild` parameter is an optional boolean parameter. If it is set to
 * `true`, the function will perform a wildcard search for the element's text. This means that it will
 * search for elements whose text contains the provided `text` parameter, rather than an exact match.
 * If `wild`
 * @returns a reference to an element in the UI based on the specified type and text. The type can be
 * either 'id' or 'text'. If the type is 'id', the function returns the element with the specified
 * accessibility id. If the type is 'text', the function returns the element with the specified text.
 * If the 'wild' parameter is provided and set to true, the
 */
export function selectElement(
  type: 'id' | 'text',
  text: string,
  wild?: boolean,
) {
  if (!browser.isAndroid) {
    switch (type) {
      case 'id':
        return $(`~${text}`);
      case 'text':
        if (wild) {
          // we check whether the name of the element contains our text and its length is less than text.length + 4.
          // we do the length check with + 4 because sometimes icons are represented in the accessibility name or label
          // of the element with a special character which can sometimes have a length of 2.
          // this is not perfect and sometimes the element may contain more than 2 icons for example. Then
          // this part of the predicate will need to be changed
          const namePredicate = `name CONTAINS[c] '${text}' && name.length <= ${
            text.length + 4
          }`;
          const labelPredicate = `label CONTAINS[c] '${text}' && label.length <= ${
            text.length + 4
          }`;
          return $(
            `-ios predicate string:(type == 'XCUIElementTypeOther' OR type == 'XCUIElementTypeStaticText') && ((${namePredicate}) || (${labelPredicate}))`,
          );
        }
        return $(`~${text}`);
    }
  }

  switch (type) {
    case 'id':
      return $(`android=new UiSelector().resourceId("${text}")`);
    case 'text':
      return $(
        `android=new UiSelector().text("${text}").className("android.widget.TextView")`,
      );
  }
}
