import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
    {
      message: [
        'deve conter ao menos um dígito',
        ' deve conter ao menos uma letra minúscula',
        ' deve conter ao menos uma letra maiúscula',
        ' deve conter ao menos um caractere especial',
        ' deve conter ao menos 8 dos caracteres mencionados',
      ].toString(),
    },
  )
  password: string;
}
