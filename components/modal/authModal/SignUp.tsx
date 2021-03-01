import React, { useEffect, useMemo, useState } from "react";
import Input from "components/common/Input";
import styled from "styled-components";
import Selector from "components/common/Selector";
import { days, months, years } from "lib/staticData";
import Button from "components/common/Button";
import { signUpAPI } from "lib/api/auth";
import useValidation from "hooks/useValidation";
import palette from "styles/palette";
import { useDispatch } from "react-redux";
import { userActions } from "store/user";
import PasswordValidation from "./PasswordValidation";
import RedXIcon from "../../../public/static/svg/auth/red_x_icon.svg";
import GreenCheckIcon from "../../../public/static/svg/auth/green_check_icon.svg";

const Container = styled.form``;

const InputContainer = styled.div`
  margin-bottom: 16px;
`;

const BirthTitle = styled.p``;

const BirthDescription = styled.p`
  font-size: 14px;
  font-weight: 300;
`;

const SelectorContainer = styled.div`
  display: flex;
  margin: 16px 0px;
`;

const ButtonContainer = styled.div`
  margin-bottom: 24px;
`;

const ErrorMessage = styled.div`
  margin-top: 8px;
  color: ${palette.tawny};
  font-weight: 300;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignUp = ({ closeModal }: { closeModal: () => void }) => {
  const dispatch = useDispatch();
  const { setValidation } = useValidation();

  const [validatePassword, setValidatePassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  const longerThanSeven = useMemo(() => {
    return password.length > 7;
  }, [password]);

  const hasNumberAndSymbol = useMemo(() => {
    return (
      /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/g.test(password) &&
      /[0-9]/g.test(password)
    );
  }, [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidation(true);
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !month ||
      !day ||
      !year ||
      !longerThanSeven ||
      !hasNumberAndSymbol
    ) {
      return;
    }
    const birthday = new Date(
      `${year.slice(0, -1)}-${month.slice(0, -1)}-${day.slice(0, -1)}`
    ).toISOString();
    const body = {
      firstName,
      lastName,
      email,
      password,
      birthday,
    };
    try {
      const { data } = await signUpAPI(body);
      dispatch(userActions.setUser(data));
      closeModal();
    } catch (error) {
      setErrorMessage(error.response.data);
    }
  };

  const handleFocus = () => {
    setValidatePassword(true);
  };

  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };
  const handleDay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDay(e.target.value);
  };
  const handleYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  useEffect(() => {
    return () => {
      setValidation(false);
    };
  }, []);

  return (
    <Container onSubmit={handleSubmit}>
      <InputContainer>
        <Input
          type="text"
          value={firstName}
          placeholder="이름"
          onChange={handleFirstName}
          isValid={!!firstName}
        />
      </InputContainer>
      <InputContainer>
        <Input
          type="text"
          value={lastName}
          placeholder="성"
          onChange={handleLastName}
          isValid={!!lastName}
        />
      </InputContainer>
      <InputContainer>
        <Input
          type="email"
          value={email}
          placeholder="이메일"
          onChange={handleEmail}
          isValid={!!email}
        />
      </InputContainer>
      <InputContainer>
        <Input
          type="password"
          value={password}
          placeholder="비밀번호"
          onChange={handlePassword}
          isValid={!!password && longerThanSeven && hasNumberAndSymbol}
          onFocus={handleFocus}
        />
        {validatePassword && (
          <>
            <PasswordValidation isValid={longerThanSeven}>
              {longerThanSeven ? <GreenCheckIcon /> : <RedXIcon />}
              최소 8자 이상이어야 합니다.
            </PasswordValidation>
            <PasswordValidation isValid={hasNumberAndSymbol}>
              {hasNumberAndSymbol ? <GreenCheckIcon /> : <RedXIcon />}
              숫자와 특수기호가 포함되어야 합니다.
            </PasswordValidation>
          </>
        )}
      </InputContainer>
      <BirthTitle>생년월일</BirthTitle>
      <BirthDescription>
        만 18세 이상의 성인만 회원으로 가입할 수 있습니다. 생년월일은
        에어비앤비의 다른 회원에게 공개되지 않습니다.
      </BirthDescription>
      <SelectorContainer>
        <Selector
          options={months}
          initialValue="월"
          value={month}
          style={{ marginRight: 16 }}
          onChange={handleMonth}
          isValid={!!month}
        />
        <Selector
          options={days}
          initialValue="일"
          value={day}
          style={{ marginRight: 16 }}
          onChange={handleDay}
          isValid={!!day}
        />
        <Selector
          options={years}
          initialValue="년"
          value={year}
          onChange={handleYear}
          isValid={!!year}
        />
      </SelectorContainer>
      <ButtonContainer>
        <Button type="submit">가입하기</Button>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </ButtonContainer>
    </Container>
  );
};

export default SignUp;
