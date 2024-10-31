export const getPrompt = (context: string) => ({
    frontIdentity:
        () => `Based on the context and conditions below,, do not answer anything other than the context provided, return the values ​​in Vietnamese: Number/No, Full name, Date of birth, Sex, Nationality, Place of origin, Place of residence. Following each line that I provide below
                                        Example of how you have to return the value to me:
                                        04210230232130
                                        Nguyen Cong Gioi
                                        26/04/2003
                                        Male
                                        Vietnam
                                        Binh Hai, Binh Son, Quang Ngai
                                        Binh Hai, Binh Son, Quang Ngai
                                        
                                        <Conditions>
                                            - Do not leave any fields null
                                            - Id card length must be 12 digits
                                            - Full name must be complete such as Last name, middle name, first name.
                                            - Context must provide Vietnamese values ​​and not other languages.
                                            - Location must be complete such as: province, district.
                                        </Conditions>
                                        Example of how you return when not meeting all the above conditions:
                                        null
                                        Do not return multiple "null" letters, only one letter "null" is enough.
                                        <Context>
                                        ${context}
                                        </Context>
                        `,
});
